import { Suspense } from "react";
import StatCard from "@/components/stat-card";
import { format } from "date-fns";

import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";

export async function Dashboard({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  // console.log({ resolvedLanguage: i18n.resolvedLanguage });

  const activites = await api.activity.getActivity();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-lg">
          <span className="font-medium">Admin Dashboard</span>
        </div>
        <div className="text-sm">
          <span>{format(new Date(), "EEEE, MMMM do, yyyy")}</span>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <StatCard
          lng={lng}
          session={session}
          name="Areas"
          count={activites.data.areaCount}
          color="#3366FF"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path>
          </svg>
        </StatCard>
        <StatCard
          lng={lng}
          session={session}
          name="Reviews"
          count={activites.data.reviewCount}
          color="#1E1E1E"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path>
          </svg>
        </StatCard>
        <StatCard
          lng={lng}
          session={session}
          name="Users"
          count={activites.data.userCount}
          color="#52BD94"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12.1597 16C10.1243 16 8.29182 16.8687 7.01276 18.2556C8.38039 19.3474 10.114 20 12 20C13.9695 20 15.7727 19.2883 17.1666 18.1081C15.8956 16.8074 14.1219 16 12.1597 16ZM12 4C7.58172 4 4 7.58172 4 12C4 13.8106 4.6015 15.4807 5.61557 16.8214C7.25639 15.0841 9.58144 14 12.1597 14C14.6441 14 16.8933 15.0066 18.5218 16.6342C19.4526 15.3267 20 13.7273 20 12C20 7.58172 16.4183 4 12 4ZM12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5ZM12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7Z"></path>
          </svg>
        </StatCard>
      </div>
    </div>
  );
}

export default function DashboardSuspense({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}): JSX.Element {
  return (
    <Suspense>
      <Dashboard lng={lng} session={session} />
    </Suspense>
  );
}
