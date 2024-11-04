import { Hash } from "lucide-react";

import UserAvatar from "@/components/user-avatar";
import MobileToggle from "@/components/mobile-toggle";
import { SocketIndicator } from "@/components/socket-indicator";
import ChatVideoButton from "@/components/chat/chat-video-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  imgUrl?: string;
  type: "channel" | "conversation";
}

const ChatHeader = ({ serverId, name, imgUrl, type }: ChatHeaderProps) => {
  return (
    <section className="h-12 px-3 semibold-text flex items-center border-neutral-300 dark:border-neutral-800 border-b">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="size-5 text-zinc-500 dark:text-zinc-400 mr-1" />
      )}
      {type === "conversation" && imgUrl && (
        <UserAvatar imgUrl={imgUrl} name={name} className="h-8 w-8 mr-2" />
      )}
      <p className="semibold-text text-xl text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === 'conversation' && (
          <ChatVideoButton/>
        )}
         <SocketIndicator/>
      </div>
    </section>
  );
};

export default ChatHeader;
