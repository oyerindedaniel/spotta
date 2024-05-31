import type { VariantProps } from "class-variance-authority";
import { AuthService, Role } from "@prisma/client";

import { badgeVariants } from "@repo/ui";

type UserRoleType = {
  value: Role;
  label: string;
  variant: VariantProps<typeof badgeVariants>["variant"];
};

export const userRole: Array<UserRoleType> = [
  {
    value: Role.ADMIN,
    label: "ADMIN",
    variant: "default",
  },
  {
    value: Role.USER,
    label: "USER",
    variant: "secondary",
  },
];

type UserAuthServiceType = {
  value: AuthService;
  label: string;
  variant: VariantProps<typeof badgeVariants>["variant"];
};

export const userAuthService: Array<UserAuthServiceType> = [
  {
    value: AuthService.CREDENTIALS,
    label: "Credentials",
    variant: "success",
  },
  {
    value: AuthService.GOOGLE,
    label: "Google",
    variant: "destructive",
  },
  {
    value: AuthService.GITHUB,
    label: "Github",
    variant: "secondary",
  },
];
