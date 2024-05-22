import { cache } from "react";
import { User } from "@prisma/client";

import { api } from "@repo/trpc/src/server";

// For RSC

export const useAuthAdmin: () => Promise<User | null> = cache(async () => {
  const session = await api.auth.getSession();

  return session && session.role === "ADMIN" ? session : null;
});
