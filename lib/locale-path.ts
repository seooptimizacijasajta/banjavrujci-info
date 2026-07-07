export const LOCALES = ["sr", "en", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "sr";

/** Prefix an internal path with the locale (sr has no prefix). Pure — safe in client components. */
export function localeHref(href: string, locale: Locale): string {
  if (locale === "sr") return href;
  if (
    href.startsWith("http") ||
    href.startsWith("#") ||
    href.startsWith("mailto") ||
    href.startsWith("tel") ||
    href.startsWith("viber") ||
    href.startsWith("//")
  ) {
    return href;
  }
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

/** Remove a leading /en or /de from a path, returning the sr-equivalent path. */
export function stripLocale(path: string): { locale: Locale; path: string } {
  const seg = path.split("/")[1];
  if (seg === "en" || seg === "de") {
    return { locale: seg, path: path.slice(seg.length + 1) || "/" };
  }
  return { locale: "sr", path };
}
