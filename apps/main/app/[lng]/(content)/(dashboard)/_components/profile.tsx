import { LanguagesType } from "@repo/i18n";

export default async function ProfilePage({ lng }: { lng: LanguagesType }) {
  return <div className="w-full">{lng}</div>;
}
