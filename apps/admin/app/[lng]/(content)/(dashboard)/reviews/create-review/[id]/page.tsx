import { redirect } from "next/navigation";

import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { CreateEditReview } from "@repo/ui";

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
