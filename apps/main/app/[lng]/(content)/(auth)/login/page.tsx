import { redirect } from "next/navigation";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import Login from "../_components/login";

export default async function LoginPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await api.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <Login lng={lng} session={session} />;
}
