import { LanguagesType } from "@repo/i18n";

interface LayoutProps extends React.PropsWithChildren<{}> {
  params: { lng: LanguagesType };
}

export default async function Layout({ children, params }: LayoutProps) {
  return (
    <main>
      <div className="mb-6 flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="mx-auto w-full max-w-[26rem] rounded-lg bg-brand-plain p-4 px-5 shadow-md">
          {children}
        </div>
      </div>
    </main>
  );
}
