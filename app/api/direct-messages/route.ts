export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
            conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
            conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    // If we got a full batch of messages (10 messages)
    if (messages.length === MESSAGES_BATCH) {
      // Set the cursor to the ID of the last message in the current batch
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("GET DIRECT MESSAGES ERROR: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
