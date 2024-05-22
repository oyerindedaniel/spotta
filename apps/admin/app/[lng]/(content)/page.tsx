"use client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";

export default function Page({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });

  return (
    <div className="flex h-[calc(100vh-64px)] justify-between gap-3 px-6 py-3 md:px-14">
      ADMIN
    </div>
  );
}
