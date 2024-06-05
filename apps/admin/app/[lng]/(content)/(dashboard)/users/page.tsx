import { getAdminUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import Users from "../_components/users";

export default async function UsersPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await getAdminUserDTO();

  return (
    <>
      <Users lng={lng} session={session} />
    </>
  );
}
