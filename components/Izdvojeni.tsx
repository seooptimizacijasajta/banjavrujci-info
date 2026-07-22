import Link from "next/link";
import { getLocale, localeHref } from "@/lib/i18n";

const ITEMS = [
  { src: "/izdvojeni/Vila_Jelena_Banja_Vrujci.jpg", href: "/smestaj/vila-jelena", alt: "Vila Jelena Banja Vrujci" },
  { src: "/izdvojeni/Vila_Sofija_Banja_Vrujci.jpg", href: "/smestaj/vila-sofija", alt: "Vila Sofija Banja Vrujci" },
  { src: "/izdvojeni/Brvnara_Vila_Petra_Banja_Vrujci.jpg", href: "/smestaj/pansion-sa-bazenom", alt: "Brvnara i Vila Petra Banja Vrujci" },
  { src: "/izdvojeni/Banja_Vrujci_Apartmani_Pakic.jpg", href: "/smestaj/apartmani-pakic", alt: "Apartmani Pakić Banja Vrujci" },
  { src: "/izdvojeni/Banja_Vrujci_Apartmani_Spa_Vrujci.jpg", href: "/smestaj/apartman-lux", alt: "Apartmani Spa Banja Vrujci" },
  { src: "/izdvojeni/apartmanibella.jpg", href: "/smestaj/apartmani-bella", alt: "Apartmani Bella Banja Vrujci" }
];

export default function Izdvojeni({ title = "Banja Vrujci Smeštaj - Izdvajamo Za Vas" }: { title?: string }) {
  const locale = getLocale();
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-slate-800 text-center">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {ITEMS.map((it) => (
          <Link key={it.href} href={localeHref(it.href, locale)}
            className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ring-1 ring-slate-200">
            <img src={it.src} alt={it.alt} className="w-full h-auto object-cover" loading="lazy" />
          </Link>
        ))}
      </div>
    </section>
  );
}
