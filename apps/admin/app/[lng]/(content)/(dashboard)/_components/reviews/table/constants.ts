import type { VariantProps } from "class-variance-authority";
import { ReviewStatus } from "@prisma/client";

import { badgeVariants } from "@repo/ui";

type ReviewStatusType = {
  value: ReviewStatus;
  label: string;
  variant: VariantProps<typeof badgeVariants>["variant"];
};

export const reviewStatus: Array<ReviewStatusType> = [
  {
    value: ReviewStatus.PENDING,
    label: "Pending",
    variant: "secondary",
  },
  {
    value: ReviewStatus.APPROVED,
    label: "Approved",
    variant: "success",
  },
  {
    value: ReviewStatus.DECLINED,
    label: "Declined",
    variant: "destructive",
  },
];
