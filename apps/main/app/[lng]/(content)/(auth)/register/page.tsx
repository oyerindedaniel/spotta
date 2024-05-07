import { redirect } from "next/navigation";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import Register from "../_components/register";

export default async function RegisterPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await api.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <Register lng={lng} />;
}
