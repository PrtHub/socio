import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import MediaRoom from "@/components/media-room";

const MemberIdPage = async ({
  params,
  searchParams,
}: {
  params: { serverId: string; memberId: string };
  searchParams: { video?: boolean };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

  return (
    <section className="bg-white dark:bg-[#313338] h-full flex flex-col">
      <ChatHeader
        name={otherMember.profile.name}
        imgUrl={otherMember.profile.imgUrl}
        serverId={params.serverId}
        type="conversation"
      />
      {searchParams?.video && (
        <MediaRoom chatId={conversation.id} audio={true} video={true} />
      )}
      {!searchParams?.video && (
        <>
          <ChatMessages
            type="conversation"
            name={otherMember.profile.name}
            member={currentMember}
            chatId={conversation.id}
            socketUrl="/api/socket/direct-messages"
            apiUrl="/api/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
            paramKey="conversationId"
            paramValue={conversation.id}
          />
          <ChatInput
            type="conversation"
            name={otherMember.profile.name}
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </section>
  );
};

export default MemberIdPage;
