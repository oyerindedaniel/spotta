import { cache } from "react";
import { User } from "@prisma/client";

import { getCurrentUser } from "./auth";

export const getAdminUserDTO = cache(async (): Promise<User | null> => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  return currentUser;
});
