import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Link,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "@/components/account-switcher";
import { PostList } from "./mail-list";
import { PostDisplay } from "./mail-display";
import { Nav } from "@/components/nav";
import { mails, type Mail } from "@/data";
import { useMail } from "@/use-mail";
import { posts, Post } from "@/data";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedPostId, setSelectedPostId] = React.useState<string | null>(
    null,
  );
  const [selectedNetwork, setSelectedNetwork] = React.useState<string | null>(
    null,
  );

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )}`;
          }}
          onResize={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2",
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Instagram",
                label: "",
                icon: Instagram,
                variant: selectedNetwork === "Instagram" ? "default" : "ghost",
                onClick: () => setSelectedNetwork("Instagram"),
              },
              {
                title: "Facebook",
                label: "",
                icon: Facebook,
                variant: selectedNetwork === "Facebook" ? "default" : "ghost",
                onClick: () => setSelectedNetwork("Facebook"),
              },
              {
                title: "YouTube",
                label: "",
                icon: Youtube,
                variant: selectedNetwork === "YouTube" ? "default" : "ghost",
                onClick: () => setSelectedNetwork("YouTube"),
              },
              {
                title: "X",
                label: "",
                icon: Twitter,
                variant: selectedNetwork === "X" ? "default" : "ghost",
                onClick: () => setSelectedNetwork("X"),
              },
              {
                title: "LinkedIn",
                label: "",
                icon: Linkedin,
                variant: selectedNetwork === "LinkedIn" ? "default" : "ghost",
                onClick: () => setSelectedNetwork("LinkedIn"),
              },
              {
                title: "Connect",
                label: "",
                icon: Link,
                variant: "default",
                // Start of Selection
                onClick: () => {
                  window.location.href =
                    "https://www.facebook.com/v20.0/dialog/oauth?client_id=2294697257538519&redirect_uri=http://localhost:5174&scope=email&response_type=code&state=123456789&auth_type=rerequest&config_id=1050051203383147";
                },
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <PostList onSelectPost={setSelectedPostId} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <PostDisplay postId={selectedPostId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
