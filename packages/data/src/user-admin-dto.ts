import { User } from "@prisma/client";

import { getCurrentUser } from "./auth";

export async function getAdminUserDTO(): Promise<User | null> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  return currentUser;
}
