import { Suspense } from "react";
import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";

import AmenitiesHeader from "./header";
import AmenitiesTable from "./table";

export default async function Amenities({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
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
