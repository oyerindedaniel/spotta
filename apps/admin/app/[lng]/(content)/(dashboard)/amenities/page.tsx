import { getAdminUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import Amenities from "../_components/amenities";

export default async function AmenitiesPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await getAdminUserDTO();

  return (
    <>
      <Amenities lng={lng} session={session} />
    </>
  );
}
