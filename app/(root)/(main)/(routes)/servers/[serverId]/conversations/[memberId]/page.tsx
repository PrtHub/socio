import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import ChatHeader from "@/components/chat/chat-header"; 
import { getOrCreateConversation } from "@/lib/conversation";

const MemberIdPage = async ({
  params,
}: {
  params: { serverId: string; memberId: string };
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
    </section>
  );
};

export default MemberIdPage;
