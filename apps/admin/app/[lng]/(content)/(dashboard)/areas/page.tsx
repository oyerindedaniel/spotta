import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import Areas from "../_components/areas";

export default async function AreasPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuthAdmin();

  return (
    <>
      <Areas lng={lng} session={session} />
    </>
  );
}
