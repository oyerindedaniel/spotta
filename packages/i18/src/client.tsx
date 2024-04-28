"use client";

import { useEffect } from "react";
import i18next from "i18next";
// import LocizeBackend from 'i18next-locize-backend'
import LanguageDetector from "i18next-browser-languagedetector";
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

  // on client side the normal singleton is ok
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../public/locales/${language}/${namespace}.json`),
      ),
    )
    // .use(LocizeBackend) // locize backend could be used on client side, but prefer to keep it in sync with server side
    .init({
      ...getOptions(),
      lng: undefined, // let detect the language on client side (using language detector)
      detection: {
        order: ["path", "htmlTag", "cookie", "navigator"],
      },
      preload: runsOnServerSide ? languages : [],
    });
};

export function useClientTranslation({
  lng = "en",
  ns = defaultNS,
  options = {},
}: {
  lng?: LanguagesType;
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
    i18n.changeLanguage(lng);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // runs on initial render
    useEffect(() => {
      if (i18n.resolvedLanguage === lng) return;
      i18n.changeLanguage(lng);
    }, [lng, i18n]);
  }

  return ret;
}
