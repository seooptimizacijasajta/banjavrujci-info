import Link from "next/link";
import { getLocale, getDict, localeHref } from "@/lib/i18n";

const CATS: { slug: string; title: string; icon: string }[] = [
  { slug: "apartmani", title: "Apartmani", icon: "🏢" },
  { slug: "vile", title: "Vile", icon: "🏡" },
  { slug: "privatni-smestaj", title: "Privatni smeštaj", icon: "🔑" },
  { slug: "bungalovi", title: "Brvnare i bungalovi", icon: "🌲" },
  { slug: "sobe", title: "Sobe", icon: "🛏️" },
  { slug: "kuce", title: "Kuće za odmor", icon: "🏠" },
  { slug: "konaci", title: "Konaci", icon: "🏨" },
  { slug: "vikendice", title: "Vikendice", icon: "⛰️" },
  { slug: "hoteli", title: "Hoteli", icon: "🏩" }
];

export default function CategoryRow() {
  const locale = getLocale();
  const t = getDict(locale);
  const catLabel = (slug: string, fallback: string) => (t.cats as Record<string, string>)[slug] ?? fallback;
  return (
    <section className="text-center">
      <p className="uppercase tracking-widest text-xs text-brand font-semibold">{t.common.byCategoryEyebrow}</p>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">{t.common.byCategoryTitle}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-9 gap-3">
        {CATS.map((c) => (
          <Link key={c.slug} href={localeHref(`/smestaj/${c.slug}`, locale)}
            className="flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow-sm hover:shadow-md hover:text-brand transition py-4 px-2">
            <span className="text-3xl">{c.icon}</span>
            <span className="text-xs font-semibold text-slate-700">{catLabel(c.slug, c.title)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
