import { useAuth } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import VerifyEmail from "../_components/verify-email";

export default async function VerfiyEmailPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuth();

  return <VerifyEmail lng={lng} session={session} />;
}
