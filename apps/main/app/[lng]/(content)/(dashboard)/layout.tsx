import { redirect } from "next/navigation";

import { useAuth } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import { SIDEBAR_LINKS } from "./_components/layout/constants";
import Sidebar from "./_components/layout/sidebar";

interface LayoutProps extends React.PropsWithChildren<{}> {
  params: { lng: LanguagesType };
}

export default async function Layout({
  children,
  params: { lng },
}: LayoutProps) {
  const session = await useAuth();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 top-0 z-10 w-[200px] -translate-x-full bg-background pt-[100px] md:translate-x-0">
        <Sidebar sidebarItems={SIDEBAR_LINKS} lng={lng} />
      </div>
      <div className="relative right-0 mt-[64px] h-full min-h-[calc(100vh-64px)] bg-white p-8 dark:bg-[#18181B] md:ml-[200px]">
        {children}
      </div>
    </>
  );
}
