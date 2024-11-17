import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }) {
    try {
      const { serverId } = params;
      const profile = await currentProfile();

      if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      if (!serverId) {
        return new NextResponse("Server ID missing", { status: 400 });
      }

      const server = await db.server.delete({
        where: {
          id: serverId,
          profileId: profile.id,
        },
      })

      return NextResponse.json(server);
    } catch (error) {
      console.log("SERVER DELETE ERROR: ", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imgUrl: imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER UPDATE ERROR: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}