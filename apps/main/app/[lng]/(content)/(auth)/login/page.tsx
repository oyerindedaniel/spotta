import { redirect } from "next/navigation";

import { useAuth } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import Login from "../_components/login";

export default async function LoginPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuth();

  if (session) {
    redirect("/");
  }

  return <Login lng={lng} session={session} />;
}
