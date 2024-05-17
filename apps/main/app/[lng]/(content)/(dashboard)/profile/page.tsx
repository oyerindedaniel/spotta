import { useAuth } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import Profile from "../_components/profile";

export default async function ProfilePage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuth();

  return (
    <>
      <Profile lng={lng} session={session} />
    </>
  );
}
