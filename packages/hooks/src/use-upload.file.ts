import * as React from "react";
import { type UseUploadthingProps } from "@uploadthing/react";

import { type OurFileRouter } from "@repo/api";
import { useUploadThing as uploadthingHook } from "@repo/utils";

interface UseUploadThingProps
  extends UseUploadthingProps<OurFileRouter, keyof OurFileRouter> {}

export function useUploadThing(
  endpoint: keyof OurFileRouter,
  props: UseUploadThingProps = {},
) {
  const [progress, setProgress] = React.useState(0);
  const { startUpload, isUploading } = uploadthingHook(endpoint, {
    onUploadProgress: () => {
      setProgress(progress);
    },
    ...props,
  });

  return {
    startUpload,
    isUploading,
    progress,
  };
}
