export const SUPPORTED_LOCALES = ["ko", "ja", "en"] as const;

export type InvitationLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: InvitationLocale = "en";

export const resolveDeviceLocale = (
  languages: readonly string[] | undefined,
): InvitationLocale => {
  for (const language of languages ?? []) {
    const baseLanguage = language.trim().toLowerCase().split("-")[0];
    if (baseLanguage === "ko" || baseLanguage === "ja" || baseLanguage === "en") {
      return baseLanguage;
    }
  }

  return DEFAULT_LOCALE;
};
