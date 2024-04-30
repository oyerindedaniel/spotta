import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

import { defaultNS, getOptions } from "./settings";
import { i18OptionsType, LanguagesType, NamespaceType } from "./types";

const initI18next = async (lng: LanguagesType, ns: NamespaceType) => {
  // on server side we create a new instance for each render, because during compilation everything seems to be executed in parallel
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../public/locales/${language}/${namespace}.json`),
      ),
    )
    .init({ ...getOptions(lng, ns) } satisfies i18OptionsType);
  return i18nInstance;
};

export async function useServerTranslation({
  lng,
  ns = defaultNS,
  keyPrefix,
}: {
  lng: LanguagesType;
  ns?: NamespaceType;
  keyPrefix?: string;
}) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      keyPrefix,
    ),
    i18n: i18nextInstance,
  };
}

export type TFuncType = Awaited<ReturnType<typeof useServerTranslation>>["t"];
