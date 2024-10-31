import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();

  if (!userId) throw new UploadThingError("Unauthorized");

  return { userId: userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(({ file }) => {
      console.log("file uploaded", file);
    }),
  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(({ file }) => {
      return {
        fileUrl: file.url,
        fileType: file.type
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
