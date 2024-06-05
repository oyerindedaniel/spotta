import HomeSearchInput from "@/components/home-search/input";

import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";

export default async function Page({
  params: { lng },
}: {
  params: { lng: LanguagesType };
}) {
  const areas = await api.area.findAllHomeSearch();

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
        <HomeSearchInput lng={lng} areas={areas.data} />
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
