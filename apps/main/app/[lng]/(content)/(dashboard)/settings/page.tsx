import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import Settings from "../_components/settings";

export default async function SettingsPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const sessions = await api.user.sessions();

  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-medium">Settings</h2>
      {/* <Suspense fallback={"loading Sessions..."}>
          <Sessions lng={lng} sessions={sessions.data} />
        </Suspense>
        <ResetPassword lng={lng} /> */}
      <Settings lng={lng} />
    </div>
  );
}
