import { Navbar } from "./_components/layout/navbar";

interface LayoutProps extends React.PropsWithChildren<{}> {}

export default async function Layout({ children }: LayoutProps) {
  return (
    <main className="bg-background">
      <Navbar />
      {children}
    </main>
  );
}
