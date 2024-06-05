import { redirect } from "next/navigation";

import { getUserDTO } from "@repo/data";
import { LanguagesType } from "@repo/i18n";

import Register from "../_components/register";

export default async function RegisterPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const session = await getUserDTO();

  if (session) {
    redirect("/");
  }

  return <Register lng={lng} />;
}
