import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  facebookTokens: defineTable({
    accessToken: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }),
  instagramProfiles: defineTable({
    id: v.optional(v.string()),
    name: v.optional(v.string()),
    website: v.optional(v.string()),
    username: v.optional(v.string()),
    mediaCount: v.optional(v.number()),
  }),
  instagramMedia: defineTable({
    instagramProfileId: v.optional(v.string()),
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
});
