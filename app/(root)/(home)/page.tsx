import { ModeToggle } from "@/components/toggle-mode";
import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return (
   <main>
     <UserButton />
      <ModeToggle/>
   </main>
  );
}
