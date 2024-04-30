import { Navbar } from "./_components/layout/navbar";

interface LayoutProps extends React.PropsWithChildren<{}> {}

export default async function Layout({ children }: LayoutProps) {
  return (
    <main className="bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="mx-auto w-full max-w-[26rem] rounded-lg bg-white p-4 px-5 shadow-md dark:bg-transparent">
          {children}
        </div>
      </div>
    </main>
  );
}
