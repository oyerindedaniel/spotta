import i18next from "i18next";
import { useTranslation as useTranslationOrg } from "react-i18next";

import { languages } from "../settings";

export type UseTranslationType = typeof useTranslationOrg;

export type i18nextType = typeof i18next;

export type i18OptionsType = i18nextType["options"];

export type LanguagesType = (typeof languages)[number];

export type NamespaceType = string | string[];
