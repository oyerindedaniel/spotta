import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import Dashboard from "../_components/dashboard";

export default async function DashboardPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuthAdmin();

  return (
    <>
      <Dashboard lng={lng} session={session} />
    </>
  );
}
