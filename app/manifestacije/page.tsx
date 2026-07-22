import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { localeUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Manifestacije i događaji — Banja Vrujci",
  description: "Kalendar manifestacija i događaja u Banji Vrujci i okolini: Kosidba na Rajcu, Dani belog narcisa, Mišićevi dani, Tešnjarske večeri i drugo."
};

const LOCALE_TAG: Record<string, string> = { sr: "sr-RS", en: "en-GB", de: "de-DE" };
const MONTHS_SR = ["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec"];

export default async function Manifestacije() {
  const locale = getLocale();
  const t = getDict(locale);
  const L = (sr: string, en: string, de: string) => (locale === "en" ? en : locale === "de" ? de : sr);
  const tag = LOCALE_TAG[locale] || "sr-RS";
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: events } = await supabase
    .from("events").select("slug,title,location,description,start_date,end_date,url,image_url")
    .eq("status", "published").order("start_date", { ascending: true });

  const all = events || [];
  const isPast = (e: any) => (e.end_date || e.start_date) < today;
  const upcoming = all.filter((e) => !isPast(e));
  const past = all.filter(isPast).reverse();

  const fmtRange = (s: string, e: string | null) => {
    const sd = new Date(s);
    if (!e || e === s) return sd.toLocaleDateString(tag, { day: "numeric", month: "long", year: "numeric" });
    const ed = new Date(e);
    const sameMonth = sd.getMonth() === ed.getMonth() && sd.getFullYear() === ed.getFullYear();
    if (sameMonth) return `${sd.getDate()}–${ed.toLocaleDateString(tag, { day: "numeric", month: "long", year: "numeric" })}`;
    return `${sd.toLocaleDateString(tag, { day: "numeric", month: "long" })} – ${ed.toLocaleDateString(tag, { day: "numeric", month: "long", year: "numeric" })}`;
  };

  const Card = ({ e, dim }: { e: any; dim?: boolean }) => {
    const sd = new Date(e.start_date);
    return (
      <div className={`flex gap-4 bg-white rounded-xl shadow p-4 ${dim ? "opacity-70" : ""}`}>
        <div className="shrink-0 w-16 text-center rounded-lg bg-brand/10 text-brand py-2">
          <div className="text-2xl font-bold leading-none">{sd.getDate()}</div>
          <div className="text-xs uppercase mt-1">{MONTHS_SR[sd.getMonth()]}</div>
          <div className="text-[11px] text-slate-400">{sd.getFullYear()}</div>
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800">{e.title}</h3>
          <div className="text-sm text-slate-500">{fmtRange(e.start_date, e.end_date)}{e.location ? ` · ${e.location}` : ""}</div>
          {e.description && <p className="text-sm text-slate-600 mt-1 line-clamp-3">{e.description}</p>}
          {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand hover:underline mt-1 inline-block">{t.common.prociraj} →</a>}
        </div>
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <div className="min-w-0">
        <nav className="text-sm text-slate-500 mb-2"><Link href={localeHref("/", locale)} className="hover:text-brand">{t.nav.pocetna}</Link> / <span className="text-brand">{t.nav.manifestacije}</span></nav>
        <h1 className="text-3xl font-bold mb-2">{t.nav.manifestacije}</h1>
        <p className="text-slate-600 mb-4">{t.common.manifestacijeSubtitle}</p>

        <div className="bg-white rounded-xl shadow-sm p-5 mb-8 text-slate-700 leading-relaxed space-y-3">
          <p>
            {L(
              "Banja Vrujci i okolina žive kroz celu godinu. Najznačajnija domaća manifestacija su „Vrujački izvori“ — sabor narodnog stvaralaštva u samoj banji, sa starim zanatima, folklorom i izlagačima iz cele Srbije. U Mionici se svakog leta održavaju Mišićevi dani, posvećeni vojvodi Živojinu Mišiću, rođenom u obližnjem Struganiku.",
              "Banja Vrujci and its surroundings are alive all year round. The most important local event is “Vrujački izvori” — a folk-craft festival in the spa itself, with traditional crafts, folklore and exhibitors from all over Serbia. Every summer Mionica hosts Mišićevi dani, dedicated to Duke Živojin Mišić, born in nearby Struganik.",
              "Banja Vrujci und die Umgebung sind das ganze Jahr über lebendig. Die wichtigste lokale Veranstaltung ist „Vrujački izvori“ — ein Volkskunstfest im Kurort selbst, mit traditionellem Handwerk, Folklore und Ausstellern aus ganz Serbien. Jeden Sommer finden in Mionica die Mišićevi dani statt, gewidmet dem Herzog Živojin Mišić, geboren im nahen Struganik."
            )}
          </p>
          <p>
            {L(
              "U krugu od sat vremena vožnje su i Kosidba na Rajcu, Dani belog narcisa i MMF festival na Divčibarama, Tešnjarske večeri u Valjevu, a nešto dalje Vukov sabor u Tršiću i Sabor trubača u Guči. Tokom zime banja živi kroz doček Nove godine, Božić i plivanje za Časni krst na Bogojavljenje.",
              "Within an hour’s drive you will also find the Rajac Mowing Competition, the Days of the White Narcissus and the MMF festival at Divčibare, Tešnjar Evenings in Valjevo, and a little further the Vuk Assembly in Tršić and the Trumpet Festival in Guča. In winter the spa comes alive with New Year’s Eve, Christmas and the Epiphany swim for the Holy Cross.",
              "Innerhalb einer Autostunde liegen außerdem der Mähwettbewerb auf dem Rajac, die Tage der weißen Narzisse und das MMF-Festival auf Divčibare, die Tešnjar-Abende in Valjevo und etwas weiter die Vuk-Versammlung in Tršić sowie das Trompetenfestival in Guča. Im Winter lebt der Kurort durch Silvester, Weihnachten und das Epiphanie-Schwimmen um das Heilige Kreuz."
            )}
          </p>
          <p className="text-sm text-slate-500">
            {L(
              "Napomena: kod tradicionalnih manifestacija tačan termin svake godine potvrđuju organizatori (Turistička organizacija Mionica i turističke organizacije susednih opština), pa datume proverite pred put.",
              "Please note: for traditional events the exact dates are confirmed each year by the organisers (the Mionica Tourist Organisation and those of neighbouring municipalities), so check the dates before travelling.",
              "Hinweis: Bei traditionellen Veranstaltungen werden die genauen Termine jedes Jahr von den Veranstaltern bestätigt (Tourismusorganisation Mionica und die der Nachbargemeinden) — bitte prüfen Sie die Daten vor der Anreise."
            )}
          </p>
        </div>

        {upcoming.length === 0 && past.length === 0 && <p className="text-slate-600">{t.common.manifestacijePrazno}</p>}

        {upcoming.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">{t.common.predstojeci}</h2>
            <div className="space-y-4">{upcoming.map((e) => <Card key={e.slug} e={e} />)}</div>
          </section>
        )}
        {past.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-500">{t.common.protekli}</h2>
            <div className="space-y-4">{past.map((e) => <Card key={e.slug} e={e} dim />)}</div>
          </section>
        )}
      </div>
      <Sidebar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        all.map((e: any) => ({
          "@context": "https://schema.org", "@type": "Event",
          "name": e.title, "startDate": e.start_date, "endDate": e.end_date || e.start_date,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": { "@type": "Place", "name": e.location || "Banja Vrujci", "address": { "@type": "PostalAddress", "addressRegion": "Srbija", "addressCountry": "RS" } },
          "description": e.description || undefined,
          "url": localeUrl("/manifestacije", locale)
        }))
      ) }} />
    </div>
  );
}
