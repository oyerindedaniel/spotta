import { RefreshToken } from "@/components/refresh-token";

import { getUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import { Navbar } from "./_components/layout/navbar";

interface LayoutProps extends React.PropsWithChildren<{}> {
  params: { lng: LanguagesType };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await getUserDTO();
  return (
    <>
      {/* <AutoCounter /> */}
      <RefreshToken session={session} />
      <Navbar lng={params.lng} session={session} />
      <main>{children}</main>
    </>
  );
}
