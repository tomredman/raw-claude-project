import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const storeFacebookToken = mutation({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    const { accessToken } = args;
    await ctx.db.insert("facebookTokens", {
      accessToken,
      createdAt: new Date().getTime(),
    });
  },
});

export const storeInstagramProfile = mutation({
  args: {
    id: v.optional(v.string()),
    name: v.optional(v.string()),
    website: v.optional(v.string()),
    username: v.optional(v.string()),
    mediaCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("instagramProfiles", args);
  },
});

export const getFacebookToken = query({
  args: {},
  handler: async (ctx) => {
    const token = await ctx.db.query("facebookTokens").order("desc").first();
    return token?.accessToken;
  },
});

export const storeInstagramMedia = mutation({
  args: {
    instagramProfileId: v.optional(v.string()),
    media: v.array(
      v.object({
        id: v.optional(v.string()),
        media_type: v.optional(v.string()),
        media_url: v.optional(v.string()),
        caption: v.optional(v.string()),
        timestamp: v.optional(v.string()),
        like_count: v.optional(v.number()),
        comments_count: v.optional(v.number()),
        impressions: v.optional(v.number()),
        reach: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { instagramProfileId, media } = args;
    for (const item of media) {
      await ctx.db.insert("instagramMedia", {
        ...item,
        instagramProfileId,
      });
    }
  },
});

export const exchangeCodeForToken = action({
  args: { code: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { code } = args;

    // Facebook App credentials (store these securely, preferably as environment variables)
    const clientId = process.env.FB_APP_ID;
    const clientSecret = process.env.FB_APP_SECRET;
    const redirectUri = process.env.FB_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Facebook App credentials are not properly configured");
    }

    // Exchange code for token
    const response = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`,
      { method: "GET" },
    );

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    const accessToken = data.access_token;

    // Store the access token in the database using the mutation
    await ctx.runMutation(api.facebook.storeFacebookToken, { accessToken });

    // Fetch user data
    const meResponse = await fetch(
      `https://graph.facebook.com/v20.0/me?access_token=${accessToken}`,
    );
    const meData = await meResponse.json();

    // Fetch accounts
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${meData.id}/accounts?access_token=${accessToken}`,
    );
    const accountsData = await accountsResponse.json();

    // For each account, get Instagram business accounts
    for (const account of accountsData.data) {
      const igAccountResponse = await fetch(
        `https://graph.facebook.com/v20.0/${account.id}?fields=instagram_business_account&access_token=${accessToken}`,
      );
      const igAccountData = await igAccountResponse.json();

      if (igAccountData.instagram_business_account) {
        const igId = igAccountData.instagram_business_account.id;
        // Fetch Instagram profile
        const igProfileResponse = await fetch(
          `https://graph.facebook.com/v20.0/${igId}?fields=id,name,website,username,media_count&access_token=${accessToken}`,
        );
        const igProfile = await igProfileResponse.json();

        // Store Instagram profile in Convex
        await ctx.runMutation(api.facebook.storeInstagramProfile, {
          id: igProfile.id,
          name: igProfile.name,
          website: igProfile.website,
          username: igProfile.username,
          mediaCount: igProfile.media_count,
        });

        // Fetch Instagram media
        const mediaResponse = await fetch(
          `https://graph.facebook.com/v20.0/${igId}/media?fields=id,media_type,media_url,caption,timestamp,like_count,comments_count,insights.metric(impressions,reach)&access_token=${accessToken}`,
        );
        const mediaData = await mediaResponse.json();

        const formattedMedia = mediaData.data.map((item: any) => ({
          id: item.id,
          media_type: item.media_type,
          media_url: item.media_url,
          caption: item.caption,
          timestamp: item.timestamp,
          like_count: item.like_count,
          comments_count: item.comments_count,
          impressions: item.insights?.data[0]?.values[0]?.value,
          reach: item.insights?.data[1]?.values[0]?.value,
        }));

        // Store Instagram media in Convex
        await ctx.runMutation(api.facebook.storeInstagramMedia, {
          instagramProfileId: igProfile.id,
          media: formattedMedia,
        });
      }
    }

    return { success: true };
  },
});

export const getInstagramMedia = query({
  args: {},
  handler: async (ctx) => {
    const media = await ctx.db
      .query("instagramMedia")
      //.order("desc", (q) => q.field("timestamp"))
      .collect();

    return media.map((post) => ({
      id: post.id,
      account: post.instagramProfileId, // We'll need to join with instagramProfiles to get the actual account name
      network: "Instagram",
      date: post.timestamp,
      caption: post.caption || "",
      views: post.impressions || 0,
      comments: post.comments_count,
      likes: post.like_count,
      shares: 0, // Instagram API doesn't provide share count
      media_url: post.media_url,
      media_type: post.media_type,
    }));
  },
});
