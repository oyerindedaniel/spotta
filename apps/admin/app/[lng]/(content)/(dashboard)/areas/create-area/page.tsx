import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import CreateArea from "../../_components/areas/create-area";

export default async function CreateAreaPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuthAdmin();

  return (
    <>
      <CreateArea lng={lng} session={session} />
    </>
  );
}
