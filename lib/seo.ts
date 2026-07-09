import type { Metadata } from "next";
import type { Locale } from "@/lib/locale-path";

/** Public base URL of the live site. Override with NEXT_PUBLIC_SITE_URL when the custom domain goes live. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://banjavrujci-info.vercel.app").replace(/\/$/, "");

/** Podrazumevana share slika (Open Graph) — koristi se kad strana/objekat nema svoju. */
export const DEFAULT_OG_IMAGE = "/hero/1.jpg";

const OG_LOCALE: Record<string, string> = { sr: "sr_RS", en: "en_US", de: "de_DE" };

/** Pretvara relativnu putanju u apsolutni URL (Open Graph zahteva apsolutne URL-ove). */
export function absUrl(path?: string | null): string {
  if (!path) return SITE_URL + DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

/** Jedinstveni SEO blok: title, description, canonical + hreflang, Open Graph i Twitter karta. */
export function buildMeta(opts: {
  title: string;
  description?: string;
  basePath: string;
  locale: Locale;
  image?: string | null;
  type?: "website" | "article";
}): Metadata {
  const { title, description, basePath, locale, image, type = "website" } = opts;
  const url = localeUrl(basePath, locale);
  const img = absUrl(image);
  const alt: string[] = (["sr", "en", "de"] as Locale[]).filter((l) => l !== locale).map((l) => OG_LOCALE[l]);
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url, languages: hreflangAlternates(basePath) },
    openGraph: {
      title, description, url, type,
      siteName: "Banja Vrujci",
      locale: OG_LOCALE[locale] || "sr_RS",
      alternateLocale: alt,
      images: [{ url: img, width: 1200, height: 630, alt: title }]
    },
    twitter: { card: "summary_large_image", title, description, images: [img] }
  };
}

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
