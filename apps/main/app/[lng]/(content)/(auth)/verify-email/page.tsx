import { getUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import VerifyEmail from "../_components/verify-email";

export default async function VerfiyEmailPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await getUserDTO();

  return <VerifyEmail lng={lng} session={session} />;
}
