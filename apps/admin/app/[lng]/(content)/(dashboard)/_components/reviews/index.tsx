import { Suspense } from "react";
import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";

import ReviewsHeader from "./header";
import ReviewsTable from "./table";

export default function Reviews({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}): JSX.Element {
  // const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-8">
      <ReviewsHeader session={session} lng={lng} />
      <Suspense fallback={<div>Loading...</div>}>
        {/* <ReviewsList session={session} lng={lng} /> */}
        <ReviewsTable session={session} lng={lng} />
      </Suspense>
    </div>
  );
}
