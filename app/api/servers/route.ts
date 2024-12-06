export const dynamic = 'force-dynamic';

import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imgUrl: imageUrl,
        inviteCode: uuid(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER CREATION ERROR: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
