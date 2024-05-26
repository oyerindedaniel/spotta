import { LanguagesType } from "@repo/i18n";

import CreateEditArea from "../../_components/areas/create-edit";

export default async function CreateAreaPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  return (
    <>
      <CreateEditArea type="create" lng={lng} />
    </>
  );
}
