'use client'

import qs from "query-string"
import { Video, VideoOff } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import ActionTooltip from "@/components/action-tooltip"


const ChatVideoButton = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const isVideo = searchParams?.get('video')

    const Icon = isVideo ? VideoOff : Video
    const toolTipLabel = isVideo ? 'End video call' : 'Start video call'

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true })

        router.push(url)
    }

  return (
    <ActionTooltip align="center" side="bottom" label={toolTipLabel}>
      <button onClick={onClick} className="hover:opacity-75 mr-4  transition">
        <Icon className="text-zinc-500 dark:text-zinc-400 size-6"/>
      </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton
