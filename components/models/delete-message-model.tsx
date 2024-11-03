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
import { useRouter } from "next/navigation";
import { useModelStore } from "@/hooks/use-model-store";

const DeleteMessageModel = () => {
  const router = useRouter();
  const { type, isOpen, onClose, data } = useModelStore();
  const { apiUrl, query } = data;

  const isModelOpen = isOpen && type === "deleteMessage";

  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });

      await axios.delete(url);

      onClose();
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 text-base">
            Are you sure you want to do this? <br />
           This message will be permanently deleted.
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

export default DeleteMessageModel;
