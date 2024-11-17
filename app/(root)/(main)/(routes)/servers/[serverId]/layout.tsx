import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import ServerSidebar from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <main className="h-full">
      <div className="hidden h-full w-60 md:flex flex-col z-20 fixed inset-y-0">
       <ServerSidebar serverId={params.serverId}/>
      </div>
      <div className="h-full md:pl-60">
      {children}
      </div>
    </main>
  );
};

export default ServerIdLayout;
