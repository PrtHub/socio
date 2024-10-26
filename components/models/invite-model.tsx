"use client";

import axios from "axios";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useOrigin } from "@/hooks/use-origin";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useModelStore } from "@/hooks/use-model-store";

const InviteModel = () => {
  const { type, isOpen, onClose, data, onOpen } = useModelStore();
  const origin = useOrigin();
  const { server } = data;

  const isModelOpen = isOpen && type === "invite";

  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const regenerateInviteLink = async () => {
    try {
      setIsLoading(true);

      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

      onOpen("invite", { server: response.data});

    } catch (error) {
      console.log(error);
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center bold-text">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-sm bold-text text-zinc-500 dark:text-secondary/70">
            Send Invite Link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
            disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0  text-black focus-visible:ring-offset-0 "
              value={inviteUrl}
            />
            <Button disabled={isLoading} size={"icon"} onClick={handleCopy}>
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <Button
            variant={"link"}
            size={"sm"}
            disabled={isLoading}
            onClick={regenerateInviteLink}
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a Link
            <RefreshCw className={`size-4 ml-2 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModel;
