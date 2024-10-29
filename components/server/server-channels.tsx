"use client";

import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "@/components/action-tooltip";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { useModelStore } from "@/hooks/use-model-store";

interface ServerChannelsProps {
  server: Server;
  channel: Channel;
  role?: MemberRole;
}

const channelIconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannels = ({ role, server, channel }: ServerChannelsProps) => {
  const { onOpen } = useModelStore();
  const router = useRouter();
  const params = useParams();

  const Icon = channelIconMap[channel?.type];

  return (
    <button
      className={cn(
        "w-full group flex items-center py-2 px-2 rounded hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel?.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="size-5 mr-2 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 semibold-text text-sm  text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel?.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel?.name}
      </p>
      {channel?.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto  flex items-center gap-x-2">
          <ActionTooltip label="Edit" side="top" align="center">
            <Edit onClick={() => onOpen("editChannel", { channel, server })} className="size-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600  dark:text-zinc-400 hover:dark:text-zinc-300 transition" />
          </ActionTooltip>
          <ActionTooltip label="Delete" side="top" align="center">
            <Trash
              onClick={() => onOpen("deleteChannel", { channel, server })}
              className="size-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600  dark:text-zinc-400 hover:dark:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel?.name === "general" && (
        <Lock className="size-4 ml-auto text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannels;
