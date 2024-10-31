"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useModelStore } from "@/hooks/use-model-store";
import AttachmentUpload from "@/components/attachment-upload";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "file is required" })
});

const MessageFileModel = () => {
  const {data, isOpen,  type, onClose} = useModelStore()
  const router = useRouter()

  const isModelOpen = isOpen && type === "messageFile"
  const {apiUrl, query} = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: ""
    },
  });

  const isPending = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   try {

    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query
    })

    await axios.post(url, {
      ...values,
      content: values.fileUrl
    })

    form.reset()
    router.refresh()
    handleClose()
   } catch (error) {
    console.log(error)
   }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white p-0 text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center bold-text">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6 px-8">
              <section className="flex justify-center items-center text-center">
               <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AttachmentUpload
                          endPoint="messageFile"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </section>
            </div>
            <DialogFooter className="px-8 py-4">
              <Button disabled={isPending} variant="primary" type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModel;
