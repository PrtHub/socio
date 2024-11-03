"use client";

import {
  ShieldAlert,
  ShieldCheck,
  FileIcon,
  Pencil,
  Trash,
} from "lucide-react";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useModelStore } from "@/hooks/use-model-store";
import ActionTooltip from "@/components/action-tooltip";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const IconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  currentMember,
  deleted,
  isUpdated,
  socketQuery,
  socketUrl,
}: ChatItemProps) => {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModelStore();

  const [isImageError, setIsImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isEditing) {
        setIsEditing(false);
        form.reset({ content });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, form, content]);

  useEffect(() => {
    form.reset({ content });
  }, [content, form]);

  useEffect(() => {
    const checkFileType = async () => {
      if (!fileUrl) return;

      try {
        const response = await fetch(fileUrl, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
        setFileType(contentType);
      } catch {
        setIsImageError(true);
      }
    };

    checkFileType();
  }, [fileUrl]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      router.refresh();
    } catch (error) {
      console.log("Message Edit Error", error);
    } finally {
      setIsEditing(false);
    }
  };

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  const isPdfFile = (contentType: string | null) => {
    return contentType?.includes("application/pdf");
  };

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <section className="relative group flex items-center p-4  w-full hover:bg-black/5 transition">
      <div className="w-full group flex items-start gap-x-2">
        <span
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar
            name={member.profile.name}
            imgUrl={member.profile.imgUrl}
          />
        </span>
        <section className="w-full flex flex-col">
          <div className="flex items-center gap-x-2">
            <section className="flex items-center">
              <p
                onClick={onMemberClick}
                className="semibold-text text-sm hover:underline transition cursor-pointer"
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {IconMap[member.role]}
              </ActionTooltip>
            </section>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {fileUrl && (
            <div className="mt-2">
              {!isPdfFile(fileType) && !isImageError ? (
                <div className="relative aspect-square rounded-md overflow-hidden flex items-center h-48 w-48">
                  <Image
                    src={fileUrl}
                    alt="Uploaded content"
                    fill
                    className="object-cover"
                    onError={() => setIsImageError(true)}
                  />
                </div>
              ) : (
                <div className="flex items-center p-2 mt-2 rounded-md bg-background/10">
                  <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                  >
                    PDF Document - Click to open
                  </a>
                </div>
              )}
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-xs  mt-1 text-zinc-500 dark:text-zinc-400"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mx-2">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="w-full flex items-center pt-2 gap-x-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="w-full relative">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size={"sm"} variant={"primary"}>
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-500 dark:text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </section>
      </div>
      {canDeleteMessage && (
        <div className="hidden  group-hover:flex items-center gap-x-2 absolute -top-2 right-5  bg-white dark:bg-zinc-800 p-1  border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Pencil
                onClick={() => setIsEditing(true)}
                className="size-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 hover:dark:text-zinc-300 cursor-pointer ml-auto  transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="size-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 hover:dark:text-zinc-300 cursor-pointer ml-auto  transition"
            />
          </ActionTooltip>
        </div>
      )}
    </section>
  );
};

export default ChatItem;
