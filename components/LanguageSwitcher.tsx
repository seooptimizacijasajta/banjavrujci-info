"use client";
import { usePathname } from "next/navigation";
import { LOCALES, stripLocale, localeHref, type Locale } from "@/lib/locale-path";

const LABELS: Record<Locale, string> = { sr: "SR", en: "EN", de: "DE" };

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || "/";
  const { path } = stripLocale(pathname);
  return (
    <div className="flex items-center gap-1.5 text-xs font-bold">
      {LOCALES.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-300">|</span>}
          {/* Običan <a> = pun reload: middleware ponovo detektuje jezik i strana se iscrta na tačnom jeziku.
              Sa Next <Link> (meka navigacija) prekidač ne bi osvežio jezik zbog internog rewrite-a. */}
          <a
            href={localeHref(path, loc)}
            className={loc === current ? "text-brand" : "text-slate-400 hover:text-brand"}
            aria-current={loc === current ? "true" : undefined}
          >
            {LABELS[loc]}
          </a>
        </span>
      ))}
    </div>
  );
}
