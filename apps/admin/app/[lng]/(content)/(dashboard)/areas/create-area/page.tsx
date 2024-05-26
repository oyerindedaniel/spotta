import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import CreateEditArea from "../../_components/areas/create-edit-area";

export default async function CreateAreaPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuthAdmin();

  return (
    <>
      <CreateEditArea type="create" lng={lng} session={session} />
    </>
  );
}
