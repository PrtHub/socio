"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endPoint: "serverImage" | "messageFile";
}

const FileUpload = ({ endPoint, onChange, value }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="w-20 h-20 relative">
        <Image
          src={value}
          width={100}
          height={100}
          alt="image"
          className="w-20 h-20 rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute  top-0 right-0 shadow-sm"
        >
          <X className="w-4 h-4" />
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
        onChange(res[0].url);
      }}
      onUploadError={(err) => {
        console.log(err);
      }}
    />
  );
};

export default FileUpload;
