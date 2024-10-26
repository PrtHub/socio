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

interface ServerHeaderProps {
  server?: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button className="w-full h-12 flex items-center justify-between text-base px-3 semibold-text border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10  dark:hover:bg-zinc-700/10 transition">
          {server?.name}
          <ChevronDown className="size-5 " />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs text-black medium-text dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-indigo-500 hover:text-white dark:hover:text-white transition rounded">
            Invite People <UserPlus className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-indigo-500 hover:text-white transition rounded">
            Server Settings
            <Settings className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-indigo-500 hover:text-white transition rounded">
            Manage Members
            <Users className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-indigo-500 hover:text-white transition rounded">
            Create Channel
            <Plus className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-500 transition px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-rose-500 hover:text-white rounded">
            Delete Server
            <Trash className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="text-emerald-500 transition px-3 py-2 cursor-pointer text-sm flex items-center hover:bg-emerald-500 hover:text-white rounded">
            Leave Server
            <LogOut className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
