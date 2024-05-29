import { redirect } from "next/navigation";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import CreateEditReview from "../../../_components/reviews/create-edit";

export default async function CreateReviewPage({
  params: { lng, id },
}: {
  params: { lng: LanguagesType; id: string };
}) {
  const review = await api.review.findById({ id });

  if (!review) {
    redirect("/reviews");
  }

  return (
    <>
      <CreateEditReview
        type="edit"
        intent="normal"
        review={review.data}
        lng={lng}
      />
    </>
  );
}
