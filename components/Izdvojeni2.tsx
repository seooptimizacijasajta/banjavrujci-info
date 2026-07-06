const ITEMS = [
  { src: "/izdvojeni2/Vila_Iva_Banja_Vrujci.jpg", href: "https://www.banjavrujci.info/smestaj/vile/vila-iva", alt: "Vila Iva Banja Vrujci" },
  { src: "/izdvojeni2/Vila_Mir_Banja_Vrujci.jpg", href: "https://www.banjavrujci.info/smestaj/apartmani/apartman-lux", alt: "Vila Mir Banja Vrujci" },
  { src: "/izdvojeni2/Vila_Ana_Banja_Vrujci.jpg", href: "https://www.banjavrujci.info/smestaj/apartmani/vila-ana", alt: "Vila Ana Banja Vrujci" },
  { src: "/izdvojeni2/Banja_Vrujci_Apartmani_Bella.jpg", href: "https://www.banjavrujci.info/smestaj/apartmani/apartmani-bella", alt: "Apartmani Bella Banja Vrujci" }
];

export default function Izdvojeni2() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-slate-800 text-center">Banja Vrujci Smeštaj Top Ponuda</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ITEMS.map((it) => (
          <a key={it.alt} href={it.href} target="_blank" rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ring-1 ring-slate-200">
            <img src={it.src} alt={it.alt} className="w-full h-auto object-cover" loading="lazy" />
          </a>
        ))}
      </div>
    </section>
  );
}
