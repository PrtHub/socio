"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModelStore } from "@/hooks/use-model-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required" })
    .refine((name) => name !== "general", {
      message: 'Channel name cannot be "general"',
    }),
  type: z.nativeEnum(ChannelType).default(ChannelType.TEXT),
});

const CreateChannelModel = () => {
  const { type, isOpen, onClose } = useModelStore();
  const router = useRouter();
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const isPending = form.formState.isSubmitting;
  const isModelOpen = isOpen && type === "createChannel";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params?.serverId,
        },
      });

      await axios.post(url, values);

      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white p-0 text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center bold-text">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6 px-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      {" "}
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter channel name"
                        className="bg-zinc-300/50  border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Channel Type</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50  border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select Channel Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-200 border-0 outline-none text-black">
                        {Object.values(ChannelType).map((value) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="capitalize"
                          >
                            {value.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-8 py-4">
              <Button disabled={isPending} variant="primary" type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModel;
