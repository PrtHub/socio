import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH(req: Request,{ params }: { params: { serverId: string } })  {
    try {
        const {serverId} = params;

        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                   deleteMany: {
                    profileId: profile.id
                   }
                }
            }
        })

        return NextResponse.json(server);
    } catch (error) {
        console.log("LEAVE SERVER ERROR: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}