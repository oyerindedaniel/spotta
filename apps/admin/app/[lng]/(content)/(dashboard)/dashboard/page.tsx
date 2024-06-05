import { getAdminUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import DashboardSuspense from "../_components/dashboard";

export default async function DashboardPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await getAdminUserDTO();

  return (
    <>
      <DashboardSuspense lng={lng} session={session} />
    </>
  );
}
