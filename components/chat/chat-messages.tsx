"use client";

import { format } from "date-fns";
import { ElementRef, Fragment, useRef } from "react";
import { Loader2, ServerCrash, ArrowUp } from "lucide-react";

import ChatItem from "./chat-item";
import ChatWelcome from "./chat-welcome";
import { Member } from "@prisma/client";
import { useChatQuery } from "@/hooks/use-chat-query";
import { MessageWithMemberWithProfile } from "@/types";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

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

  const topRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

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

  useChatScroll({
    bottomRef,
    topRef,
    shouldLoadMore: !!hasNextPage && !isFetchingNextPage,
    loadMore: fetchNextPage,
    count: data?.pages[0].items.length || 0,
  });

  // Loading previous messages UI
  const loadingPreviousMessages = (
    <div className="flex items-center justify-center space-x-2 mb-4 mt-4">
      <Loader2 className="size-4 animate-spin text-zinc-500" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Loading previous messages...
      </p>
    </div>
  );

  // Load more button UI
  const loadMoreButton = (
    <button
      onClick={() => fetchNextPage()}
      disabled={!hasNextPage || isFetchingNextPage}
      className="text-xs bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-600 
        dark:text-zinc-400 hover:dark:text-zinc-300 transition py-2 px-4 rounded-md
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-x-2"
    >
      {hasNextPage ? (
        <>
          <ArrowUp className="size-4" />
          Load previous messages
        </>
      ) : (
        "No more messages"
      )}
    </button>
  );

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
    <div ref={topRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={type} />}
      
      {/* Improved loading UI */}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage 
            ? loadingPreviousMessages
            : loadMoreButton
          }
        </div>
      )}

      <section className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                {...message}
                currentMember={member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
            {/* Show page separator for better context */}
            {i < data.pages.length - 1 && (
              <div className="flex items-center justify-center my-2">
                <div className="h-px bg-zinc-200 dark:bg-zinc-700 w-full mx-8" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {format(
                    new Date(group.items[group.items.length - 1].createdAt),
                    "MMMM d, yyyy"
                  )}
                </span>
                <div className="h-px bg-zinc-200 dark:bg-zinc-700 w-full mx-8" />
              </div>
            )}
          </Fragment>
        ))}
      </section>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
