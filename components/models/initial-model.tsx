'use client'

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";

const createFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

const joinFormSchema = z.object({
  inviteLink: z.string().min(1, { message: "Invite link is required" }),
});

const InitialModel = () => {
  const [isCreating, setIsCreating] = useState(true);
  const router = useRouter();

  const createForm = useForm({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const joinForm = useForm({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      inviteLink: "",
    },
  });

  const isPending = isCreating ? createForm.formState.isSubmitting : joinForm.formState.isSubmitting;

  const handleCreateSubmit = async (values: z.infer<typeof createFormSchema>) => {
    try {
      await axios.post("/api/servers", values);
      createForm.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinSubmit = async (values: z.infer<typeof joinFormSchema>) => {
    router.push(`${values.inviteLink}`);
  };

  return (
    <Dialog open>
      <DialogContent className="bg-white p-0 text-black overflow-hidden">
        <div className="flex items-center border-b border-zinc-300">
          <div
            className={`flex-1 px-6 py-3 text-center cursor-pointer transition ${
              isCreating ? "bg-indigo-500 text-white semibold-text" : "hover:bg-zinc-100/50"
            }`}
            onClick={() => setIsCreating(true)}
          >
            Create
          </div>
          <div
            className={`flex-1 px-6 py-3 text-center cursor-pointer transition ${
              !isCreating ? "bg-indigo-500 text-white semibold-text" : "hover:bg-zinc-100/50"
            }`}
            onClick={() => setIsCreating(false)}
          >
            Join
          </div>
        </div>

        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center bold-text">
            {isCreating ? "Create a Server" : "Join a Server"}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {isCreating
              ? "Customize your server with a name and an image."
              : "Enter the invite link to join a server."}
          </DialogDescription>
        </DialogHeader>

        {isCreating ? (
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-8">
              <div className="space-y-6 px-6">
                <section className="flex justify-center items-center text-center">
                  <FormField
                    control={createForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endPoint="serverImage"
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter server name"
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-6 py-4">
                <Button disabled={isPending} variant="primary" type="submit">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...joinForm}>
            <form onSubmit={joinForm.handleSubmit(handleJoinSubmit)} className="space-y-8">
              <div className="space-y-6 px-6">
                <FormField
                  control={joinForm.control}
                  name="inviteLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Invite Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter invite link"
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-6 py-4">
                <Button disabled={isPending} variant="primary" type="submit">
                  Join
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InitialModel;