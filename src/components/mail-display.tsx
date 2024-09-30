import { format } from "date-fns/format";
import { Eye, MessageCircle, Heart, BarChart2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PostDisplayProps {
  postId: string | null;
}

export function PostDisplay({ postId }: PostDisplayProps) {
  const posts = useQuery(api.facebook.getInstagramMedia);
  const post = posts?.find((p) => p.id === postId) || null;

  if (!post) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No post selected
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={`https://avatar.vercel.sh/${post.account}.png`}
              alt={post.account}
            />
            <AvatarFallback>{post.account[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{post.account}</h2>
            <p className="text-sm text-muted-foreground">{post.network}</p>
          </div>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {format(new Date(post.date), "PPpp")}
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4 aspect-square max-w-sm mx-auto bg-muted flex items-center justify-center">
          {post.media_type === "IMAGE" ? (
            <img
              src={post.media_url}
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-muted-foreground">Post Preview</span>
          )}
        </div>
        <p className="mb-2 text-sm">{post.caption}</p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views} views
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.comments} comments
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post.likes} likes
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            {post.shares} shares
          </div>
        </div>
      </div>
      <Separator className="mt-auto" />
      <div className="p-4">
        <Button className="w-full">View on {post.network}</Button>
      </div>
    </div>
  );
}
