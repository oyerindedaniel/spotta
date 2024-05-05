"use client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import { Button } from "@repo/ui";

export default function Page({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  const isSiteOkay = api.auth.getSession.useQuery();

  console.log("issiteoks", isSiteOkay.data);

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });

  return (
    <main className="bg-blue-300">
      {isSiteOkay.isFetching && <h1>Loading...</h1>}
      {isSiteOkay && isSiteOkay.data && <h1>{isSiteOkay.data}</h1>}
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
