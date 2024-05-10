import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import Session from "./session";

export default async function Sessions({
  lng,
  user,
}: {
  lng: LanguagesType;
  user: User | null;
}) {
  // const getUserSessions = nextCache(
  //   async () => api.user.sessions(),
  //   ["user-session"],
  //   { revalidate: 5 },
  // );

  // const sessions = await getUserSessions();
  const sessions = await api.user.sessions();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      {sessions.data.map((session) => (
        <Session session={session} lng={lng} />
      ))}
    </div>
  );
}
