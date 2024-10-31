import { NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer, Socket } from "net";

import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};
