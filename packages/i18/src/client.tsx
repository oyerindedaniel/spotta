"use client";

import { useEffect } from "react";
import i18next from "i18next";
// import LocizeBackend from 'i18next-locize-backend'
import LanguageDetector from "i18next-browser-languagedetector";
// import XHR from "i18next-http-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";

import { defaultNS, getOptions, languages } from "./settings";
import { i18OptionsType, LanguagesType, NamespaceType } from "./types";

const runsOnServerSide = typeof window === "undefined";

let hasInit = false;

const initialize = () => {
  if (hasInit) {
    return;
  }
  hasInit = true;

  i18next
    // .use(XHR)
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: string) => {
        return import(`../public/locales/${language}/${namespace}.json`);
      }),
    )
    // .use(LocizeBackend) // locize backend could be used on client side, but prefer to keep it in sync with server side
    .init({
      ...getOptions(),
      detection: {
        order: ["path", "htmlTag", "localStorage", "navigator"],
      },
      preload: runsOnServerSide ? languages : [],
    } satisfies i18OptionsType);
};

export function useClientTranslation({
  lng,
  ns = defaultNS,
  options = {},
}: {
  lng: LanguagesType;
  ns?: NamespaceType;
  options?: i18OptionsType;
}) {
  initialize();
  const ret = useTranslationOrg(ns, options);
  /**
   * Provides translation function (t) and i18n instance to use translation features.
   * For more information, see: https://react.i18next.com/latest/usetranslation-hook
   */
  const { i18n } = ret;

  if (runsOnServerSide && i18n.resolvedLanguage !== lng) {
    // ON LOAD OR REFRESH
    // Next picks the resolvedLanguage has "en" always
    // On the client it then try to get the resolvedLanguage based on the detection order
    // CAUSING HYDRATION ERROR
    // therefore we have to pass the lng allows to the hook
    // console.log("----------runserverside", {
    //   resolvedLng: i18n.resolvedLanguage,
    //   lng,
    // });
    i18n.changeLanguage(lng);
  } else {
    // console.log("----------client", {
    //   resolvedLng: i18n.resolvedLanguage,
    //   lng,
    // });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (i18n.resolvedLanguage === lng) return;
      i18n.changeLanguage(lng);
    }, [lng, i18n]);
  }

  return ret;
}
