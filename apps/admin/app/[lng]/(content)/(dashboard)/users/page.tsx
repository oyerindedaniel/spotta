import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import Users from "../_components/users";

export default async function UsersPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuthAdmin();

  return (
    <>
      <Users lng={lng} session={session} />
    </>
  );
}
