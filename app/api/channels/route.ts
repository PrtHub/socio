import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const profile = await currentProfile();

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (name === "general") {
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      });
    }

    const channel = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("CHANNEL CREATION ERROR: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
