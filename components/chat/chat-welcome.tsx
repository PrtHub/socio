import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  return (
    <section className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="size-[75px] flex items-center justify-center rounded-full  bg-zinc-500 dark:bg-zinc-700">
          <Hash className="size-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl semibold-text">
        {type === "channel" ? `Welcome to #${name} channel` : `${name}`}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? `This is the start of #${name} channel`
          : `This is the start of your conversation with ${name}`}
      </p>
    </section>
  );
};

export default ChatWelcome;
