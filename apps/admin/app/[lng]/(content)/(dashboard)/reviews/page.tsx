import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import Reviews from "../_components/reviews";

export default async function ReviewsPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuthAdmin();

  return (
    <>
      <Reviews lng={lng} session={session} />
    </>
  );
}
