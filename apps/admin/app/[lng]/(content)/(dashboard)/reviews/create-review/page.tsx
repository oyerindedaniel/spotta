import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import CreateReview from "../../_components/reviews/create";

export default async function CreateReviewPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuthAdmin();

  return (
    <>
      <CreateReview lng={lng} session={session} />
    </>
  );
}
