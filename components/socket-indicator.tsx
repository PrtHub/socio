"use client";

import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/components/providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-600 border-none text-white"
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }
  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-600 border-none text-white"
    >
      Live
    </Badge>
  );
};
