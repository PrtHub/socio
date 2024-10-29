import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import ChatHeader from "@/components/chat/chat-header";

const ChannelIdPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!member || !channel) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] h-full flex flex-col">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
