import { Suspense } from "react";
import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";

import AreasHeader from "./header";
import AreasTable from "./table";

export default async function Areas({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  return (
    <div className="flex flex-col gap-8">
      <AreasHeader session={session} lng={lng} />
      <Suspense fallback={<div>Loading...</div>}>
        <AreasTable session={session} lng={lng} />
      </Suspense>
    </div>
  );
}
