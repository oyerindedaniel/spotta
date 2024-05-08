import { LanguagesType } from "@repo/i18n";

export default async function ProfilePage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  return <h1>DASHBOARD</h1>;
}
