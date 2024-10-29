"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ imgUrl, name, className }: { imgUrl: string; name: string, className?: string }) => {
  return (
    <Avatar className={cn("rounded-full", className)}>
      <AvatarImage src={imgUrl} alt={name} />
      <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
