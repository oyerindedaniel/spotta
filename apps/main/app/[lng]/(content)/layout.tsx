import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import { Navbar } from "./_components/layout/navbar";

interface LayoutProps extends React.PropsWithChildren<{}> {
  params: { lng: LanguagesType };
}

export default async function Layout({ children, params }: LayoutProps) {
  const session = await api.auth.getSession();
  return (
    <>
      <Navbar lng={params.lng} session={session} />
      {children}
    </>
  );
}
