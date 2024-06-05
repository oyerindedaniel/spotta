import { getAdminUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import { ReviewsListSuspense } from "../../_components/reviews/list";

export default async function AreasPage({
  params: { lng, id },
}: {
  params: { lng: LanguagesType; id: string };
}) {
  const session = await getAdminUserDTO();

  return (
    <>
      <ReviewsListSuspense id={id} lng={lng} session={session} />
    </>
  );
}
