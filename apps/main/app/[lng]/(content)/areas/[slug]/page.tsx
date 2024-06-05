import { getUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import AreaSuspense from "../../_components/area";

export default async function AreaPage({
  params: { lng, slug },
}: {
  params: { lng: LanguagesType; slug: string };
}) {
  const session = await getUserDTO();

  return (
    <>
      <AreaSuspense lng={lng} slug={slug} session={session} />
    </>
  );
}
