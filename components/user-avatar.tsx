"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ imgUrl, name }: { imgUrl: string; name: string }) => {
  return (
    <Avatar className="size-7 md:size-10">
      <AvatarImage src={imgUrl} alt={name} />
      <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
