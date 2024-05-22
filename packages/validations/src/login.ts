import { Role } from "@prisma/client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
  asRole: z.enum([Role.USER, Role.ADMIN]).default(Role.USER),
});

export { loginSchema };
