"use client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";

export default function LoginPage({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });
  return (
    <div className="">
      <h1>Login</h1>
    </div>
  );
}
