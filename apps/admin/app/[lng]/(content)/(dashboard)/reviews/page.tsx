import { getAdminUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import Reviews from "../_components/reviews";

export default async function ReviewsPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await getAdminUserDTO();

  return (
    <>
      <Reviews lng={lng} session={session} />
    </>
  );
}
