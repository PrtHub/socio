"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModelStore } from "@/hooks/use-model-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  channelType?: ChannelType;
  sectionType?: "channels" | "members";
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  server,
  channelType,
  sectionType,
}: ServerSectionProps) => {
  const { onOpen } = useModelStore();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase semibold-text text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== "GUEST" && sectionType === "channels" && (
        <ActionTooltip label="Create channel" side="top" align="center">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300 transition"
          >
            <Plus className="size-4" />
          </button>
        </ActionTooltip>
      )}
      {role === "ADMIN" && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top" align="center">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300 transition"
          >
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
