//retrieval, transformation, and packaging of data
import { cache } from "react";

import { api } from "@repo/api/src/server";
import { UserSession } from "@repo/types";

export const getCurrentUser = cache(async (): Promise<UserSession> => {
  const session = await api.auth.getSession();
  return session;
});
