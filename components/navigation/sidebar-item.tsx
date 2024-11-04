"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarItemProps {
  id: string;
  name: string;
  icon: string;
}

const SidebarItem = ({ id, name, icon }: SidebarItemProps) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`/servers/${id}`);
  };
  return (
    <ActionTooltip label={name} side="right" align="center">
      <button onClick={onClick} className="group flex items-center relative">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "group relative w-[48px] h-[48px] mx-3 flex items-center justify-center rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image src={icon} alt={name} fill />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default SidebarItem;
