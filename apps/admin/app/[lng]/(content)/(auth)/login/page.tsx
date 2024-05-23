import { redirect } from "next/navigation";

import { useAuthAdmin } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";

import Login from "../_components/login";

export default async function LoginPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await useAuthAdmin();

  if (session) {
    redirect("/");
  }

  return <Login lng={lng} session={session} />;
}
