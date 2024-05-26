import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import CreateReview from "../../_components/reviews/create-edit";

export default async function CreateReviewPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  return (
    <>
      <CreateReview lng={lng} type="create" />
    </>
  );
}
