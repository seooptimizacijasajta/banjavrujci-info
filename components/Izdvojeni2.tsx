import Link from "next/link";
import { getLocale, localeHref } from "@/lib/i18n";

const ITEMS = [
  { src: "/izdvojeni2/Vila_Iva_Banja_Vrujci.jpg", href: "/smestaj/vila-iva", alt: "Vila Iva Banja Vrujci" },
  { src: "/izdvojeni2/Vila_Ana_Banja_Vrujci.jpg", href: "/smestaj/vila-ana", alt: "Vila Ana Banja Vrujci" }
];

export default function Izdvojeni2() {
  const locale = getLocale();
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-slate-800 text-center">Banja Vrujci Smeštaj Top Ponuda</h2>
      <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
        {ITEMS.map((it) => (
          <Link key={it.alt} href={localeHref(it.href, locale)}
            className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ring-1 ring-slate-200">
            <img src={it.src} alt={it.alt} className="w-full h-auto object-cover" loading="lazy" />
          </Link>
        ))}
      </div>
    </section>
  );
}
