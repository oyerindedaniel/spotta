import { cache } from "react";
import { User } from "@prisma/client";

import { api } from "@repo/trpc/src/server";

// For react server components

export const useAuth: () => Promise<User | null> = cache(async () => {
  const session = await api.auth.getSession();

  return session;
});
