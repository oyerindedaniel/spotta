import { LanguagesType } from "@repo/i18n";

import ResetPassword from "../_components/settings/reset-password";
import Sessions from "../_components/settings/sessions";

export default async function SettingsPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  return (
    <div className="w-full">
      <h2 className="mb-3 text-2xl font-medium">Settings</h2>
      <div className="flex w-full justify-between gap-6">
        <Sessions lng={lng} />
        <ResetPassword lng={lng} />
      </div>
    </div>
  );
}
