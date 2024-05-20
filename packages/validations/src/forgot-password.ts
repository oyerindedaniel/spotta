import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

const forgotPasswordConfirmationSchema = z
  .object({
    otp: z.string().min(6, {
      message: "Your one-time code must be 6 characters.",
    }),
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

type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

type ForgotPasswordConfirmationType = z.infer<
  typeof forgotPasswordConfirmationSchema
>;

type ForgotPasswordUnion = ForgotPasswordType | ForgotPasswordConfirmationType;

enum ForgotPasswordEnum {
  ForgotPassword = "ForgotPassword",
  ForgotPasswordConfirmation = "ForgotPasswordConfirmation",
}

export {
  ForgotPasswordEnum,
  forgotPasswordConfirmationSchema,
  forgotPasswordSchema,
  type ForgotPasswordConfirmationType,
  type ForgotPasswordType,
  type ForgotPasswordUnion,
};
