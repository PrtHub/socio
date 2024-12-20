"use client";

import { useParams, useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Member, MemberRole, Profile, Server } from "@prisma/client";

import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";

interface ServerMembersProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="size-5 ml-1 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-5 ml-1 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};

const ServerMembers = ({ member, server }: ServerMembersProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const handleClick = () => {
    router.push(`/servers/${server?.id}/conversations/${member?.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full group flex items-center py-2 px-2 rounded hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member?.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        name={member?.profile?.name}
        imgUrl={member?.profile?.imgUrl}
        className="size-7 mr-2 flex-shrink-0"
      />
      <p
        className={cn(
          "line-clamp-1 semibold-text text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member?.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member?.profile?.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMembers;
