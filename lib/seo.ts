import type { Locale } from "@/lib/locale-path";

/** Public base URL of the live site. Override with NEXT_PUBLIC_SITE_URL when the custom domain goes live. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://banjavrujci-info.vercel.app").replace(/\/$/, "");

/** Absolute URL for a base (Serbian-equivalent) path in a given locale. */
export function localeUrl(basePath: string, locale: Locale): string {
  const path = basePath.startsWith("/") ? basePath : `/${basePath}`;
  if (locale === "sr") return SITE_URL + path;
  const suffix = path === "/" ? "" : path;
  return `${SITE_URL}/${locale}${suffix}`;
}

/** hreflang alternates map for a base path (sr/en/de + x-default). */
export function hreflangAlternates(basePath: string) {
  return {
    "sr-RS": localeUrl(basePath, "sr"),
    en: localeUrl(basePath, "en"),
    de: localeUrl(basePath, "de"),
    "x-default": localeUrl(basePath, "sr")
  };
}
