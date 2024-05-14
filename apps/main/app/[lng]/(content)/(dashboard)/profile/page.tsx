import { LanguagesType } from "@repo/i18n";

import Profile from "../_components/profile";

export default async function ProfilePage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  return <Profile lng={lng} />;
}
