import { getAdminUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";
import { RefreshToken } from "@repo/ui";

import { Navbar } from "./navbar";

interface LayoutProps extends React.PropsWithChildren<{}> {
  params: { lng: LanguagesType };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await getAdminUserDTO();

  return (
    <>
      <RefreshToken session={session} />
      <Navbar lng={params.lng} session={session} />
      <main>{children}</main>
    </>
  );
}
