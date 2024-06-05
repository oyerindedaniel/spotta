import { redirect } from "next/navigation";

import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";

import CreateEditAmenity from "../../../_components/amenities/create.edit";

export default async function EditAmenityPage({
  params: { lng, id },
}: {
  params: { lng: LanguagesType; id: string };
}) {
  const amenity = await api.amenity.findById({ id });

  if (!amenity) {
    redirect("/amenities");
  }

  return (
    <>
      <CreateEditAmenity type="edit" amenity={amenity.data} lng={lng} />
    </>
  );
}
