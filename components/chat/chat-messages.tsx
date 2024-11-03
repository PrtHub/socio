"use client";

import { format } from "date-fns";
import { Fragment } from "react";
import ChatItem from "./chat-item";
import { Member } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { MessageWithMemberWithProfile } from "@/types";
import { useChatSocket } from "@/hooks/use-chat-socket";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    });

  useChatSocket({
    addKey,
    updateKey,
    queryKey,
  });

  if (status === "pending") {
    return (
      <div className="flex-1 flex items-center justify-center flex-col">
        <Loader2 className="size-7 animate-spin my-2 text-zinc-500" />
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-1 flex items-center justify-center flex-col">
        <ServerCrash className="size-7 my-2 text-zinc-500" />
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={name} type="channel" />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                currentMember={member}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                fileUrl={message.fileUrl}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default ChatMessages;
