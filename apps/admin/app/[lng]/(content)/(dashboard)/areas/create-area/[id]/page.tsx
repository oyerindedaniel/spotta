import { redirect } from "next/navigation";

import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";

import CreateEditArea from "../../../_components/areas/create-edit";

export default async function EditAreaPage({
  params: { lng, id },
}: {
  params: { lng: LanguagesType; id: string };
}) {
  const area = await api.area.findById({ id });

  if (!area) {
    redirect("/areas");
  }

  return (
    <>
      <CreateEditArea type="edit" area={area.data} lng={lng} />
    </>
  );
}
