import { LanguagesType } from "@repo/i18n";
import { CreateEditReview } from "@repo/ui";

export default async function CreateReviewPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  return (
    <>
      <CreateEditReview lng={lng} type="create" intent="normal" />
    </>
  );
}
