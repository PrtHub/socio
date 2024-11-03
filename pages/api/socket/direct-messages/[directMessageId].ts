import { NextApiRequest } from "next";

import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextApiResponseWithSocket } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    if (!directMessageId) {
      return res.status(400).json({ error: "Missing directMessageId" });
    }

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
          memberOne: {
            profileId: profile.id,
          }
          },
          {
            memberTwo: {
              profileId: profile.id,
            }
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

  
    const member = conversation.memberOne.profileId === profile.id
      ? conversation.memberOne
      : conversation.memberTwo;
    
  
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isOwner = member.id === message.memberId;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("MESSAGE_ID ERROR", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
