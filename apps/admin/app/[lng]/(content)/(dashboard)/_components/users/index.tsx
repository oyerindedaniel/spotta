import { Suspense } from "react";
import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";

import UsersHeader from "./header";
import UsersTable from "./table";

export default function Users({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-8">
      <UsersHeader session={session} lng={lng} />
      <Suspense fallback={<div>Loading...</div>}>
        {/* <UsersList session={session} lng={lng} /> */}
        <UsersTable session={session} lng={lng} />
      </Suspense>
    </div>
  );
}
