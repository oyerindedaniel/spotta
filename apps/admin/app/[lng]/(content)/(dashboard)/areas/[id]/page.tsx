import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import CreateEditArea from "../../_components/areas/create-edit-area";

export default async function CreateAreaPage({
  params: { lng, id },
}: {
  params: { lng: LanguagesType; id: number };
}) {
  const session = await useAuthAdmin();

  return (
    <>
      <CreateEditArea asEdit lng={lng} session={session} />
    </>
  );
}
