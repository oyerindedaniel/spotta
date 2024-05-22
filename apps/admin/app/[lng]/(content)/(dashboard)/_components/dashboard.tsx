"use client";

import { User } from "@prisma/client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";

export default function Dashboard({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });

  return <>sss</>;
}
