const BANNERS = [
  { href: "http://www.banjesrbije.biz", src: "/baneri/banje-srbije.gif", alt: "Banje Srbije - Turistički portal banja u Srbiji" },
  { href: "http://www.tara-apartmani.com", src: "/baneri/tara-apartmani.jpg", alt: "Tara apartmani" },
  { href: "/", src: "/baneri/banja-vrujci468x60.jpg", alt: "Banja Vrujci" },
  { href: "https://onlinepozivnice.rs/", src: "/baneri/online-pozivnice.webp", alt: "Online pozivnice za rođendane" }
];

const A = (href: string, text: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{text}</a>
);

export default function FriendsLinks() {
  return (
    <div className="space-y-4 text-slate-700 leading-relaxed">
      <p>
        Stranica sadrži banere i linkove sa srodnih turističkih sajtova. Možete pronaći čitav niz interesantnih izvora
        vezanih za turizam, smeštaj, apartmane, privatan smeštaj, hotele, vile i sve druge tipove smeštaja i turizma u
        celini. Nadamo se da ćete pronaći neki interesantan link za Vas.
      </p>

      <div className="flex flex-wrap items-center gap-4 py-2">
        {BANNERS.map((b) => (
          <a key={b.src} href={b.href} target={b.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" title={b.alt}>
            <img src={b.src} alt={b.alt} loading="lazy" className="max-w-full h-auto rounded shadow-sm" />
          </a>
        ))}
      </div>

      <p>{A("https://www.divcibare.org.rs", "Divčibare")} kao turistički centar nudi neograničene mogućnosti za odmor, zabavu, rekreaciju i sport. Ukoliko planirate da posetite planinu Divčibare, svakako će vam biti od velike koristi da pronađete adekvatan smeštaj, bilo da su u pitanju {A("http://www.divcibare.org.rs/apartmani-divcibare", "apartmani na Divčibarama")}, hoteli, vile, konaci, odmarališta, vikendice ili neki drugi privatni smeštaj.</p>

      <p>{A("https://www.beogradnet.net", "Firme Beograd")} na jednom mestu. Beograd Net je privredni adresar pravnih lica, imenik firmi u Beogradu na jednom mestu. Pronađite firme iz Beograda i cele Srbije i dodajte svoju firmu.</p>

      <p>{A("https://apartmentshalkidiki.net", "Halkidiki apartments")} for sale in Pefkohori Kassandra and Psakoudia Sithonia.</p>

      <p>{A("https://www.prirodnikamen.org.rs", "Prirodni kamen")} — direktorijum firmi koje se bave eksploatacijom, prodajom, ugradnjom i prevozom prirodnog kamena za enterijer i eksterijer.</p>

      <p>{A("https://www.apartmanirandjelovic.com", "Sokobanja apartmani Ranđelović")} — provedite prijatan odmor u Sokobanji u apartmanima porodice Ranđelović koji se nalaze na dve atraktivne lokacije.</p>

      <p>{A("https://www.banjavrujci.biz", "Banja Vrujci Privatni Smeštaj")}</p>

      <p>{A("https://www.vrujci.org", "Banja Vrujci Smeštaj")}</p>

      <p>{A("https://www.banja-vrujci.net", "Banja Vrujci")} privatni smeštaj — apartmani, sobe, hoteli, vile i ostali privatni smeštaj u Banji Vrujci sa foto-galerijom Banje Vrujci i okoline, direktorijum linkova i kontakt.</p>

      <p>{A("https://www.banja-vrujci.org", "Banja Vrujci")} — apartmani, smeštaj i privatni smeštaj u Banji Vrujci.</p>

      <p>{A("https://www.banja-vrujci.co.rs", "Banja Vrujci co.rs")} — Banja Vrujci prirodna oaza zdravlja.</p>

      <p>{A("https://www.optimizacijasajta.org", "Optimizacija sajtova")} za Google i SEO optimizacija za druge internet pretraživače. SEO usluge, direktorijumi, prva strana na Google — popravite poziciju sajta na Google.</p>

      <p>{A("https://www.banjavrujci.eu", "Banja Vrujci eu")} — mini portal Banje Vrujci sa galerijom slika i kontaktom.</p>

      <p>{A("http://vrnjackabanja.cu.rs", "Vrnjačka Banja")} — mali ali praktični turistički vodič Vrnjačke Banje.</p>

      <p>{A("http://www.banjakoviljaca.info", "Banja Koviljača")} — turistički vodič Banje Koviljače.</p>

      <p>{A("http://www.mionica.eu", "Mionica")} — informativni portal opštine Mionica.</p>

      <p>{A("http://www.linkovi.in.rs", "Linkovi")} — katalog kvalitetnih i bezbednih linkova, provereni linkovi iz Srbije i ex-Yu.</p>

      <p>{A("http://www.sremskamitrovica.org", "Sremska Mitrovica")} — informativni portal Sremske Mitrovice: vesti, mapa, slike, vremenska prognoza.</p>

      <p>{A("http://www.raskrsnica.com", "Raskrsnica")} — Raskrsnica linkova.</p>

      <p>{A("http://www.turizam.autentik.net/", "Turizam u Jagodini, Ćupriji i Paraćinu")} — restorani, kafane, hoteli, smeštaj, sobe, apartmani.</p>

      <p>{A("https://www.sokobanja.net", "Soko Banja")} — apartmani, smeštaj, sobe, nekretnine, vesti, zabava.</p>

      <p>{A("https://www.sokobanja-apartmani.com", "sokobanja-apartmani.com")} — apartmani u Soko Banji.</p>

      <p>{A("https://www.sokobanja.travel/", "Sokobanja")} — turistički vodič kroz banju.</p>

      <p>{A("https://www.sokobanja.com/", "Soko banja")} — portal banje.</p>
    </div>
  );
}
