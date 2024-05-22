import { Role } from "@prisma/client";
import { z } from "zod";

export const oauthSchema = z.object({
  code: z.string(),
  asRole: z.enum([Role.USER, Role.ADMIN]).default(Role.USER),
});
