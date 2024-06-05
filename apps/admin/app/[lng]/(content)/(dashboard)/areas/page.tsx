import { getAdminUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import Areas from "../_components/areas";

export default async function AreasPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await getAdminUserDTO();

  return (
    <>
      <Areas lng={lng} session={session} />
    </>
  );
}
