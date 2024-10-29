import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelType, MemberRole } from "@prisma/client";
import ServerHeader from "@/components/server/server-header";
import ServerSearch from "@/components/server/server-search";
import ServerMembers from "@/components/server/server-members";
import ServerSection from "@/components/server/server-section";
import ServerChannels from "@/components/server/server-channels";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="size-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="size-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="size-4 mr-2" />,
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="size-4 mr-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};

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

  const textChannels = server?.channels?.filter((channel) => {
    return channel.type === ChannelType.TEXT;
  });
  const audioChannels = server?.channels?.filter((channel) => {
    return channel.type === ChannelType.AUDIO;
  });
  const videoChannels = server?.channels?.filter((channel) => {
    return channel.type === ChannelType.VIDEO;
  });

  const members = server?.members?.filter((member) => {
    return member.profileId !== profile.id;
  });

  if (!server) return redirect("/");

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <section className="w-full h-full flex flex-col text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-400 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <section className="mb-2">
            <ServerSection
              label="Text Channels"
              role={role}
              channelType={ChannelType.TEXT}
              sectionType="channels"
            />
            {textChannels?.map((channel) => (
              <ServerChannels
                key={channel.id}
                server={server}
                channel={channel}
                role={role}
              />
            ))}
          </section>
        )}
        {!!audioChannels?.length && (
          <section className="mb-2">
            <ServerSection
              label="Audio Channels"
              role={role}
              channelType={ChannelType.AUDIO}
              sectionType="channels"
            />
            {audioChannels?.map((channel) => (
              <ServerChannels
                key={channel.id}
                server={server}
                channel={channel}
                role={role}
              />
            ))}
          </section>
        )}
        {!!videoChannels?.length && (
          <section className="mb-2">
            <ServerSection
              label="Video Channels"
              role={role}
              channelType={ChannelType.VIDEO}
              sectionType="channels"
            />
            {videoChannels?.map((channel) => (
              <ServerChannels
                key={channel.id}
                server={server}
                channel={channel}
                role={role}
              />
            ))}
          </section>
        )}
        {!!members?.length && (
          <section className="mb-2">
            <ServerSection
              label="Members"
              role={role}
              server={server}
              sectionType="members"
            />
            {members?.map((member) => (
              <ServerMembers key={member.id} server={server} member={member} />
            ))}
          </section>
        )}
      </ScrollArea>
    </section>
  );
};

export default ServerSidebar;
