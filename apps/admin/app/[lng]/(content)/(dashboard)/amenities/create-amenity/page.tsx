import { LanguagesType } from "@repo/i18n";

import CreateEditAmenity from "../../_components/amenities/create.edit";

export default async function CreateAreaPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  return (
    <>
      <CreateEditAmenity type="create" lng={lng} />
    </>
  );
}
