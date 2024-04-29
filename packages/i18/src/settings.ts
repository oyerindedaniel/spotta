export const fallbackLng = "en" as const;
export const languages = [fallbackLng, "fr"] as const;
export const defaultNS = "common" as const;

export function getOptions(
  lng: (typeof languages)[number] = fallbackLng,
  ns: string | string[] = defaultNS,
) {
  return {
    // debug: true,
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS:
      Array.isArray(ns) && ns.length > 1
        ? ns.filter((ns) => ns !== defaultNS)
        : undefined,
    defaultNS,
    ns,
    // backend: {
    //   projectId: '01b2e5e8-6243-47d1-b36f-963dbb8bcae3'
    // }
  };
}

/**
 * Difference between ns, defaultNs and fallbackNs.
 * For more information, see: https://www.i18next.com/principles/fallback#namespace-fallback
 */
