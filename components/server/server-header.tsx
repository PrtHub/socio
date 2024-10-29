"use client";

import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  Plus,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useModelStore } from "@/hooks/use-model-store";

interface ServerHeaderProps {
  server?: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModelStore();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button className="w-full h-12 flex items-center justify-between text-base px-3 semibold-text border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10  dark:hover:bg-zinc-700/10 transition">
          {server?.name}
          <ChevronDown className="size-5 hidden md:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs text-black medium-text dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-indigo-500 hover:text-white dark:hover:text-white transition rounded border-none outline-none"
          >
            Invite People <UserPlus className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-indigo-500 hover:text-white transition rounded border-none outline-none"
          >
            Server Settings
            <Settings className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-indigo-500 hover:text-white transition rounded border-none outline-none"
          >
            Manage Members
            <Users className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-indigo-500 hover:text-white transition rounded border-none outline-none"
          >
            Create Channel
            <Plus className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="text-rose-500 transition px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-rose-500 hover:text-white rounded border-none outline-none"
          >
            Delete Server
            <Trash className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="text-rose-500 transition px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-rose-500 hover:text-white rounded border-none outline-none"
          >
            Leave Server
            <LogOut className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
