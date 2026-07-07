import { headers } from "next/headers";
import sr from "@/messages/sr.json";
import en from "@/messages/en.json";
import de from "@/messages/de.json";
import { type Locale } from "@/lib/locale-path";

export { LOCALES, DEFAULT_LOCALE, localeHref, stripLocale } from "@/lib/locale-path";
export type { Locale } from "@/lib/locale-path";

const DICTS = { sr, en, de } as const;
export type Dict = typeof sr;

export function getLocale(): Locale {
  const l = headers().get("x-locale");
  return l === "en" || l === "de" ? l : "sr";
}

export function getDict(locale?: Locale): Dict {
  return DICTS[locale ?? getLocale()];
}
