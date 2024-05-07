"use client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { Button } from "@repo/ui";

export default function Page({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });

  return (
    <main className="bg-blue-300">
      <p>Daniel</p>

      <Button
        variant="destructive"
        onClick={() => {
          i18n.changeLanguage("en", (err) => {
            if (err) return console.log("something went wrong loading", err);
          });
        }}
        type="button"
        size="lg"
      >
        Change EN
      </Button>
      <Button
        onClick={() => {
          i18n.changeLanguage("fr", (err) => {
            if (err) return console.log("something went wrong loading", err);
          });
        }}
        type="button"
        size="lg"
      >
        Change FR
      </Button>
      <p>{t("app-name")}</p>
    </main>
  );
}
