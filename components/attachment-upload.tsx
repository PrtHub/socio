"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";

interface AttachmentUploadProps {
  onChange: (url: string) => void;
  value?: string;
  endPoint: "messageFile";
}

const AttachmentUpload = ({ endPoint, onChange, value }: AttachmentUploadProps) => {
  const [fileType, setFileType] = useState<string | null>(null);
  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    const checkFileType = async () => {
      if (!value) return;

      try {
        const response = await fetch(value, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
        setFileType(contentType);
      } catch {
        setIsImageError(true);
      }
    };

    checkFileType();
  }, [value]);

  const isPdfFile = (contentType: string | null) => {
    return contentType?.includes("application/pdf");
  };

  if (value) {
    if (!isPdfFile(fileType) && !isImageError) {
      return (
        <div className="w-20 h-20 relative">
          <Image
            src={value}
            width={100}
            height={100}
            alt="image"
            className="w-20 h-20 rounded-full"
            onError={() => setIsImageError(true)}
          />
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          >
            <X className="w-4 h-4 text-white hover:text-zinc-200" />
          </button>
        </div>
      );
    }

    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          type="button"
          className="absolute -top-2 -right-2 p-1 rounded-full shadow-sm bg-rose-500"
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4 text-white hover:text-zinc-200" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      appearance={{
        button:
          "ut-uploading:cursor-not-allowed bg-indigo-500 cursor-pointer outline-none after:bg-indigo-600",
        label: "text-indigo-500",
      }}
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onChange(res[0].url);
        }
      }}
      onUploadError={(err) => {
        console.log(err);
      }}
    />
  );
};

export default AttachmentUpload;
