"use client";

import axios from "axios";
import qs from "query-string";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModelStore } from "@/hooks/use-model-store";

const DeleteChannelModel = () => {
  const router = useRouter();
  const params = useParams()
  const { type, isOpen, onClose, data } = useModelStore();
  const { channel } = data;

  const isModelOpen = isOpen && type === "deleteChannel";

  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      });

      await axios.delete(url);

      onClose();
      router.push(`/servers/${params.serverId}`)
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center bold-text">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 text-base">
            Are you sure you want to do this? <br />
            This will permanently delete your{" "}
            <span className="font-semibold text-indigo-500">
              {channel?.name}
            </span>{" "}
            channel.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 mx-auto w-full max-w-sm">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onDelete}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModel;
