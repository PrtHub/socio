import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import ServerHeader from "@/components/server/server-header";

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/sign-in");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.TEXT;
  });
  const audioChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.AUDIO;
  });
  const videoChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.VIDEO;
  });

  const members = server?.members.filter((member) => {
    return member.profileId !== profile.id;
  });

  if (!server) return redirect("/");

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <section className="w-full h-full flex flex-col text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </section>
  );
};

export default ServerSidebar;
