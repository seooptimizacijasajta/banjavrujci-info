"use client";
import Link from "next/link";
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
          <Link
            href={localeHref(path, loc)}
            className={loc === current ? "text-brand" : "text-slate-400 hover:text-brand"}
            aria-current={loc === current ? "true" : undefined}
          >
            {LABELS[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}
