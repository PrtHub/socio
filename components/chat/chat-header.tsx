import { Hash } from "lucide-react"
import MobileToggle from "@/components/mobile-toggle"

interface ChatHeaderProps {
    serverId: string
    name: string
    imgUrl?: string
    type: "channel" | "conversation"
}

const ChatHeader = ({ serverId, name, imgUrl, type }: ChatHeaderProps) => {
  return (
    <section className="h-12 px-3 semibold-text flex items-center border-neutral-300 dark:border-neutral-800 border-b">
      <MobileToggle serverId={serverId}/>
      {type === 'channel' && (
        <Hash className="size-5 text-zinc-500 dark:text-zinc-400 mr-1"/>
      )}
      <p className="semibold-text text-xl text-black dark:text-white">{name}</p>
    </section>
  )
}

export default ChatHeader
