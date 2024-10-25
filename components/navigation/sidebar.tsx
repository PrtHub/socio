import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/toggle-mode";
import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarItem from "@/components/navigation/sidebar-item";
import NavigationAction from "@/components/navigation/navigation-action";

const Sidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <section className="w-full h-full space-y-4 flex flex-col items-center py-3 text-primary dark:bg-[#1E1F22]">
      <NavigationAction />
      <Separator className="w-10 h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto" />
      <ScrollArea>
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <SidebarItem
              id={server.id}
              name={server.name}
              icon={server.imgUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto h-full flex flex-col items-center justify-end gap-y-4">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-12 h-12",
            },
          }}
        />
      </div>
    </section>
  );
};

export default Sidebar;
