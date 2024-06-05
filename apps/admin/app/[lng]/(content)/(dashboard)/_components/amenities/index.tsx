import { Suspense } from "react";

import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";

import AmenitiesHeader from "./header";
import AmenitiesTable from "./table";

export default async function Amenities({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  return (
    <div className="flex flex-col gap-8">
      <AmenitiesHeader session={session} lng={lng} />
      <Suspense fallback={<div>Loading...</div>}>
        <AmenitiesTable session={session} lng={lng} />
      </Suspense>
    </div>
  );
}
