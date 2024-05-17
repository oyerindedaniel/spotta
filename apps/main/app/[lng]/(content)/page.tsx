"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { Button, Input } from "@repo/ui";

export default function Page({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });

  return (
    <div className="flex h-[calc(100vh-64px)] justify-between gap-3 px-6 py-3 md:px-14">
      <div className="w-[50%] self-center">
        <h1 className="mb-6 text-6xl font-bold">
          Find a place you will love to live!
        </h1>
        <p className="mb-8 text-2xl">
          See through the lenses of people who have lived or visited the
          neighbourhood you might have in mind.
        </p>
        <form>
          <Input
            className="mb-4"
            leftIcon={
              <MagnifyingGlassIcon className="size-5 text-[#0D2159] dark:text-[#BACAF5]" />
            }
            placeholder="Enter Address"
          />
          <Button type="submit" size="lg" className="uppercase">
            Search
          </Button>
        </form>
      </div>
      <div className="w-[40%]"></div>
    </div>
  );
}

{
  /* <Button
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
      </Button> */
}
{
  /* <p>{t("app-name")}</p> */
}
