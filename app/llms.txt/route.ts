import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const U = (p: string) => SITE_URL + p;

const CATS: [string, string][] = [
  ["Apartmani", "/smestaj/apartmani"],
  ["Vile", "/smestaj/vile"],
  ["Privatni smeštaj", "/smestaj/privatni-smestaj"],
  ["Sobe", "/smestaj/sobe"],
  ["Brvnare i bungalovi", "/smestaj/bungalovi"],
  ["Konaci", "/smestaj/konaci"],
  ["Vikendice", "/smestaj/vikendice"],
  ["Hoteli", "/smestaj/hoteli"]
];

const OBANJI: [string, string][] = [
  ["O Banji Vrujci", "/banja-vrujci"],
  ["Bazeni", "/bazeni"],
  ["Lekovita svojstva banje", "/lekovita-svojstva-banje"],
  ["Istorijat banje", "/istorijat-banje"],
  ["Priroda i zdravlje", "/priroda-i-zdravlje"],
  ["Sport i rekreacija", "/sport-i-rekreacija"],
  ["Okolina i turističke atrakcije", "/okolina-turisticke-atrakcije"],
  ["Divčibare", "/divcibare"],
  ["Rajac", "/rajac"],
  ["Ravna Gora", "/ravna-gora"],
  ["Manastir Ćelije", "/manastir-celije"],
  ["Mionica", "/mionica"]
];

export async function GET() {
  const supabase = createClient();
  const [{ data: posts }, { data: listings }] = await Promise.all([
    supabase.from("posts").select("slug,title,excerpt,published_at").eq("status", "published").order("published_at", { ascending: false }).limit(30),
    supabase.from("listings").select("slug,title,excerpt").eq("status", "approved").order("promo_tier", { ascending: false }).limit(20)
  ]);

  const lines: string[] = [];
  lines.push("# Banja Vrujci — turistički portal");
  lines.push("");
  lines.push("> Zvanični turistički portal Banje Vrujci (opština Mionica, zapadna Srbija): smeštaj, termalni bazeni, lekovita voda i blato, priroda, okolina, manifestacije i praktični vodiči. Sadržaj je dostupan na srpskom (podrazumevano), engleskom (/en) i nemačkom (/de).");
  lines.push("");
  lines.push("Banja Vrujci se nalazi u dolini reke Toplice, oko 90 km od Beograda, u podnožju Divčibara i Rajca. Poznata je po termomineralnoj vodi (izvori kapaciteta do 300 l/s), lekovitom blatu i otvorenim/zatvorenim bazenima. Portal objedinjuje ponudu smeštaja (apartmani, vile, sobe, hoteli, privatni smeštaj), nekretnine, blog sa vodičima i vestima, video galeriju i kalendar manifestacija.");
  lines.push("");

  lines.push("## Smeštaj");
  lines.push(`- [Sav smeštaj u Banji Vrujci](${U("/smestaj")})`);
  for (const [n, p] of CATS) lines.push(`- [${n}](${U(p)})`);
  if (listings && listings.length) {
    lines.push("");
    lines.push("### Izdvojeni objekti");
    for (const l of listings) lines.push(`- [${l.title}](${U(`/smestaj/${l.slug}`)})${l.excerpt ? ": " + String(l.excerpt).replace(/\s+/g, " ").slice(0, 140) : ""}`);
  }
  lines.push("");

  lines.push("## O banji i okolini");
  for (const [n, p] of OBANJI) lines.push(`- [${n}](${U(p)})`);
  lines.push("");

  lines.push("## Manifestacije i događaji");
  lines.push(`- [Kalendar manifestacija](${U("/manifestacije")}): Kosidba na Rajcu, Dani belog narcisa, Mišićevi dani, Tešnjarske večeri, Plivanje za Časni krst, Doček Nove godine.`);
  lines.push("");

  lines.push("## Nekretnine");
  lines.push(`- [Nekretnine u Banji Vrujci](${U("/nekretnine")}): kuće, stanovi, placevi, vikendice, apartmani.`);
  lines.push("");

  lines.push("## Blog i vodiči");
  lines.push(`- [Blog](${U("/blog")})`);
  for (const p of posts || []) lines.push(`- [${p.title}](${U(`/blog/${p.slug}`)})${p.excerpt ? ": " + String(p.excerpt).replace(/\s+/g, " ").slice(0, 140) : ""}`);
  lines.push("");

  lines.push("## Multimedija");
  lines.push(`- [Galerija fotografija](${U("/galerija")})`);
  lines.push(`- [Video galerija](${U("/video")})`);
  lines.push("");

  lines.push("## Kontakt");
  lines.push(`- [Kontakt](${U("/kontakt")})`);
  lines.push("- Telefon / Viber / WhatsApp: +381 64 459 8778");
  lines.push("- E-mail: info@banjavrujci.info");
  lines.push("");

  lines.push("## Jezici");
  lines.push(`- Srpski: ${SITE_URL}/`);
  lines.push(`- English: ${SITE_URL}/en`);
  lines.push(`- Deutsch: ${SITE_URL}/de`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
