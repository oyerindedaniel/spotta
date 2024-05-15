import type { FileRouter } from "uploadthing/next";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { useAuth } from "@repo/hooks";

const f = createUploadthing();

export const ourFileRouter = {
  profileImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await useAuth();
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      return { uploadedBy: metadata.userId };
    }),
  test: f(["image"])
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const user = await useAuth();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
