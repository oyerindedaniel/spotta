import { User } from "@prisma/client";

import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";

import Session from "./session";

export default async function Sessions({
  lng,
  user,
}: {
  lng: LanguagesType;
  user: UserDTO;
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
        <Session key={session.id} session={session} lng={lng} />
      ))}
    </div>
  );
}
