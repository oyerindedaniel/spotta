import { redirect } from "next/navigation";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import CreateEditArea from "../../_components/areas/create-edit-area";

export default async function CreateAreaPage({
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
