import { RefreshToken } from "@/components/refresh-token";
import AutoCounter from "@/components/test";

import { useAuth } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import { Navbar } from "./_components/layout/navbar";

interface LayoutProps extends React.PropsWithChildren<{}> {
  params: { lng: LanguagesType };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await useAuth();
  return (
    <>
      {/* <AutoCounter /> */}
      <RefreshToken session={session} />
      <Navbar lng={params.lng} session={session} />
      <main> {children}</main>
    </>
  );
}
