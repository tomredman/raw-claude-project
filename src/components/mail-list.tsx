import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, MessageCircle, Heart } from "lucide-react";

interface PostListProps {
  onSelectPost: (id: string) => void;
}

export function PostList({ onSelectPost }: PostListProps) {
  const posts = useQuery(api.facebook.getInstagramMedia);

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {posts.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
            )}
            onClick={() => onSelectPost(item.id)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{item.account}</div>
                <Badge variant="outline">{item.network}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.date), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <div className="line-clamp-2 text-sm">{item.caption}</div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {item.views}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {item.comments}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {item.likes}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
