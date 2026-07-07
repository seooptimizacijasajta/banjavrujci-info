import Link from "next/link";
import { getLocale, getDict, localeHref } from "@/lib/i18n";

export default function Banners() {
  const locale = getLocale();
  const t = getDict(locale);
  return (
    <section className="grid gap-4 md:grid-cols-3 -mt-2">
      {/* 1. Zeleni — Banja Vrujci */}
      <div className="rounded-xl p-5 bg-brand text-white flex flex-col">
        <h3 className="text-lg font-bold mb-2"><span className="text-white">BANJA</span> VRUJCI</h3>
        <p className="text-sm text-teal-50 flex-1">{t.banners.p1}</p>
        <Link href={localeHref("/banja-vrujci", locale)} className="mt-4 inline-block bg-white text-brand font-semibold rounded px-4 py-2 text-sm w-fit hover:bg-teal-50">
          {t.banners.cta1}
        </Link>
      </div>

      {/* 2. Beli — Smeštaj */}
      <div className="rounded-xl p-5 bg-white border border-slate-200 text-slate-700 flex flex-col shadow-sm">
        <h3 className="text-lg font-bold mb-2"><span className="text-brand">SMEŠTAJ</span> BANJA VRUJCI</h3>
        <p className="text-sm text-slate-600 flex-1">{t.banners.p2}</p>
        <Link href={localeHref("/smestaj", locale)} className="mt-4 inline-block bg-brand text-white font-semibold rounded px-4 py-2 text-sm w-fit hover:bg-brand-dark">
          {t.banners.cta2}
        </Link>
      </div>

      {/* 3. Zeleni — Nekretnine */}
      <div className="rounded-xl p-5 bg-brand text-white flex flex-col">
        <h3 className="text-lg font-bold mb-2"><span className="text-white">NEKRETNINE</span> BANJA VRUJCI</h3>
        <p className="text-sm text-teal-50 flex-1">{t.banners.p3}</p>
        <Link href={localeHref("/nekretnine", locale)} className="mt-4 inline-block bg-white text-brand font-semibold rounded px-4 py-2 text-sm w-fit hover:bg-teal-50">
          {t.banners.cta3}
        </Link>
      </div>
    </section>
  );
}
