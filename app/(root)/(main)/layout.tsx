import Sidebar from "@/components/navigation/sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" h-full">
      <section className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Sidebar />
      </section>
      <div className="h-full md:pl-[72px]">{children}</div>
    </main>
  );
};

export default MainLayout;
