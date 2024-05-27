"use client";

import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { z } from "zod";

import { RouterOutputs } from "@repo/api";
import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import { Review, useToast } from "@repo/ui";
import { updateReviewReactionSchema } from "@repo/validations";

export type AreaType = RouterOutputs["area"]["findById"]["data"];

type ReviewReactionType = z.infer<typeof updateReviewReactionSchema>;

export default function Lists({
  lng,
  session,
  area,
}: {
  lng: LanguagesType;
  session: User | null;
  area: AreaType;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const { name, state, reviews } = area ?? {};

  const { id: userId } = session ?? {};

  const mutateReviewReaction = api.review.reviewReaction.useMutation({
    onSuccess: ({ data }) => {
      toast({
        variant: "success",
        description: `Successfully updated review reaction`,
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description:
          error?.message ?? "Error updating review reaction. Try again",
      });
      console.error(error);
      router.refresh();
    },
  });

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">
        {name}, {state}
      </h2>
      <div className="flex w-[65%] flex-col gap-6">
        {reviews?.map((review) => (
          <Review review={review} mutateFunc={mutateReviewReaction.mutate} />
        ))}
      </div>
    </div>
  );
}
