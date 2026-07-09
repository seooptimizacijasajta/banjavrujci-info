type Banner = { src: string; href: string | null; alt: string };

// Promotivni / oglasni baneri (raniji "iznad smeštaja") + partnerski logo baneri.
const BANNERS: Banner[] = [
  { src: "/baneri/Divcibare-Vrujci.jpg", href: "https://www.divcibare.org.rs", alt: "Divčibare" },
  { src: "/baneri/lux-kuca-na-prodaju.jpg", href: "/nekretnine/kuce", alt: "Lux kuća na prodaju u Banji Vrujci" },
  { src: "/baneri/stan-na-prodaju-vila-sunce-baner.jpg", href: "/nekretnine/stanovi", alt: "Stan na prodaju — Vila Sunce" },
  { src: "/baneri/domacinstvo-lazic-baner1.jpg", href: "/domacinstvo-lazic", alt: "Domaćinstvo Lazić" },
  { src: "/baneri/banja-vrujci-vauceri.jpg", href: null, alt: "Banja Vrujci vaučeri" },
  { src: "/baneri/banja-vrujci-kosenje-dvorista.jpg", href: null, alt: "Košenje dvorišta Banja Vrujci" },
  { src: "/baneri/lumi-pocetna.webp", href: null, alt: "Lumi" },
  { src: "/baneri/optimizacija_sajta.gif", href: "https://www.optimizacijasajta.org", alt: "Optimizacija sajta" },
  { src: "/baneri/bs100x50.jpg", href: "http://www.banjesrbije.biz", alt: "Banje Srbije" },
  { src: "/baneri/mionica_100x50.png", href: "http://www.mionica.eu", alt: "Mionica" },
  { src: "/baneri/sokobanja.png", href: "https://www.sokobanja.travel/", alt: "Sokobanja" },
  { src: "/baneri/sokobanjanet.gif.png", href: "https://www.sokobanja.net", alt: "Soko Banja" },
  { src: "/baneri/linkovi_logo_100x50.gif.png", href: "http://www.linkovi.in.rs", alt: "Linkovi" }
];

// Linkovi ka mreži naših portala.
const PORTALS: { href: string; label: string }[] = [
  { href: "https://www.banjavrujci.info", label: "banjavrujci.info" },
  { href: "https://blog.banjavrujci.info", label: "blog.banjavrujci.info" },
  { href: "https://www.banja-vrujci.net", label: "banja-vrujci.net" },
  { href: "https://www.banja-vrujci.org", label: "banja-vrujci.org" },
  { href: "https://www.banjavrujci.eu", label: "banjavrujci.eu" },
  { href: "https://www.banja-vrujci.co.rs", label: "banja-vrujci.co.rs" },
  { href: "https://www.vrujci.org", label: "vrujci.org" },
  { href: "https://www.banjavrujci.biz", label: "banjavrujci.biz" },
  { href: "https://www.prirodnikamen.org.rs", label: "Prirodni kamen" },
  { href: "https://www.divcibare.org.rs", label: "Divčibare" }
];

export default function FooterBanners() {
  return (
    <div className="border-t border-slate-700">
      <div className="mx-auto max-w-[1380px] px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {BANNERS.map((b) => {
            const img = <img src={b.src} alt={b.alt} title={b.alt} loading="lazy" className="h-[52px] w-auto rounded bg-white/5" />;
            return b.href ? (
              <a key={b.src} href={b.href} target={b.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="shrink-0">{img}</a>
            ) : (
              <span key={b.src} className="shrink-0">{img}</span>
            );
          })}
        </div>
        <div className="mt-5 text-center text-xs text-slate-400">
          <span className="text-slate-300">Naši portali:</span>{" "}
          {PORTALS.map((p, i) => (
            <span key={p.href}>
              {i > 0 && <span className="text-slate-600"> · </span>}
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">{p.label}</a>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
