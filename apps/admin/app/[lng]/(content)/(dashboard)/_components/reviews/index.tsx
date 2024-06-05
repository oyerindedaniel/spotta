import { Suspense } from "react";

import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";

import ReviewsHeader from "./header";
import ReviewsTable from "./table";

export default function Reviews({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
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
