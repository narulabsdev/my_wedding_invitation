"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  resolveDeviceLocale,
  type InvitationLocale,
} from "./locale";

const readDeviceLocale = () =>
  resolveDeviceLocale(
    navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language],
  );

export function useDeviceLocale(): InvitationLocale {
  const [locale, setLocale] = useState<InvitationLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const syncLocale = () => {
      const nextLocale = readDeviceLocale();
      setLocale(nextLocale);
      document.documentElement.lang = nextLocale;
    };

    syncLocale();
    window.addEventListener("languagechange", syncLocale);

    return () => window.removeEventListener("languagechange", syncLocale);
  }, []);

  return locale;
}
