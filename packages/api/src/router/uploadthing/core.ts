import type { FileRouter } from "uploadthing/next";
import cookie from "cookie";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { COOKIE_NAME } from "../../config";
import { verifyToken } from "../../middleware/auth";

const f = createUploadthing();

const auth = async (req: Request) => {
  const cookies = cookie.parse(req.headers?.get?.("cookie") ?? "");
  const accessToken = cookies[COOKIE_NAME] ?? "";

  const session = await verifyToken(accessToken);

  return session?.user;
};

export const ourFileRouter = {
  profileImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1, minFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, file };
    }),
  areaMediasUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 6, minFileCount: 3 },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
