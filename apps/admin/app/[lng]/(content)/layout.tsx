import { RefreshToken } from "@/components/refresh-token";

import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import { Navbar } from "./navbar";

interface LayoutProps extends React.PropsWithChildren<{}> {
  params: { lng: LanguagesType };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await useAuthAdmin();

  // if (!session) {
  //   redirect("/login");
  // }

  return (
    <>
      <RefreshToken session={session} />
      <Navbar lng={params.lng} session={session} />
      <main>{children}</main>
    </>
  );
}
