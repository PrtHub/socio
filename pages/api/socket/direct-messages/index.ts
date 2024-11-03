import { NextApiRequest } from "next";

import { db } from "@/lib/db";
import { NextApiResponseWithSocket } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profle = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    if (!profle) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profle.id,
            }
          },
         {
            memberTwo: {
              profileId: profle.id,
            }
         }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          }
        },
        memberTwo: {
          include: {
            profile: true,
          }
        }
      }
    })

    if(!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const member = conversation.memberOne.profileId === profle.id
      ? conversation.memberOne
      : conversation.memberTwo

    if(!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const conversationKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(conversationKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("DIRECT MESSAGES API ERROR", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
