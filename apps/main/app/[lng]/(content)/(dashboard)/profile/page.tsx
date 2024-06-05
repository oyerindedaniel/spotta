import { getUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import Profile from "../_components/profile";

export default async function ProfilePage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await getUserDTO({ update: true });

  return (
    <>
      <Profile lng={lng} session={session} />
    </>
  );
}
