const ITEMS = [
  { src: "/izdvojeni/Vila_Jelena_Banja_Vrujci.jpg", href: "https://www.banjavrujci.info/smestaj/vile/vila-jelena", alt: "Vila Jelena Banja Vrujci" },
  { src: "/izdvojeni/Vila_Sofija_Banja_Vrujci.jpg", href: "https://www.banjavrujci.info/smestaj/vile/vila-sofija", alt: "Vila Sofija Banja Vrujci" },
  { src: "/izdvojeni/Brvnara_Vila_Petra_Banja_Vrujci.jpg", href: "https://www.banjavrujci.info/smestaj/privatni-smestaj/pansion-sa-bazenom", alt: "Brvnara i Vila Petra Banja Vrujci" },
  { src: "/izdvojeni/Banja_Vrujci_Apartmani_Pakic.jpg", href: "https://www.banjavrujci.info/smestaj/apartmani/apartmani-pakic", alt: "Apartmani Pakić Banja Vrujci" },
  { src: "/izdvojeni/Banja_Vrujci_Apartmani_Spa_Vrujci.jpg", href: "https://www.banjavrujci.info/smestaj/apartmani/apartman-lux", alt: "Apartmani Spa Banja Vrujci" }
];

export default function Izdvojeni() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-slate-800 text-center">Banja Vrujci Smeštaj - Izdvajamo Za Vas</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {ITEMS.map((it) => (
          <a key={it.href} href={it.href} target="_blank" rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ring-1 ring-slate-200">
            <img src={it.src} alt={it.alt} className="w-full h-auto object-cover" loading="lazy" />
          </a>
        ))}
      </div>
    </section>
  );
}
