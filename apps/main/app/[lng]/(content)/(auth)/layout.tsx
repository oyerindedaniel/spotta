import { LanguagesType } from "@repo/i18n";

interface LayoutProps extends React.PropsWithChildren<{}> {
  params: { lng: LanguagesType };
}

export default async function Layout({ children, params }: LayoutProps) {
  return (
    <main>
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        {children}
      </div>
    </main>
  );
}
