import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  phone: z.string().trim().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email" }),
});

const registerSchema = userSchema
  .extend({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const updateSchema = userSchema.extend({
  picture: z.union([z.array(z.instanceof(File)), z.array(z.string().url())]),
});

export { registerSchema, updateSchema };
