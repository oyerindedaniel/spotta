"use client";

import type { ClientUploadedFileData } from "uploadthing/types";
import * as React from "react";
import { UploadFilesOptions } from "uploadthing/types";

import type { OurFileRouter } from "@repo/api";
import { uploadFiles } from "@repo/uploadthing";

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {}

export function useUploadThing(
  endpoint: keyof OurFileRouter,
  props: UseUploadFileProps = {},
) {
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadThings(files: File[]): Promise<UploadedFile[]> {
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file]: progress,
            };
          });
        },
      });
      return res;
    } catch (err) {
      throw err;
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    startUpload: uploadThings,
    isUploading,
    progresses,
  };
}
