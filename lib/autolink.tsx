import React from "react";
import Link from "next/link";
import { localeHref } from "@/lib/i18n";
import type { Locale } from "@/lib/locale-path";

type Entry = { base: string; path: string; rx: RegExp };

// base = slug strane na koju vodi (za izbegavanje self-linka); path = odredište; rx = šablon (bez global flaga)
function E(base: string, path: string, ...alts: string[]): Entry {
  return { base, path, rx: new RegExp(`(?<![\\p{L}\\-/])(?:${alts.join("|")})(?![\\p{L}])`, "iu") };
}

function proper(): Entry[] {
  return [
    E("hoteli", "/smestaj/hoteli", "Hotel\\p{L}* Vrujci"),
    E("kosidba-na-rajcu", "/kosidba-na-rajcu", "Kosidb\\p{L}* na Rajcu"),
    E("misicevi-dani", "/misicevi-dani", "Mišićev\\p{L}* dan\\p{L}*"),
    E("manastir-celije", "/manastir-celije", "Manastir\\p{L}* Ćelij\\p{L}*", "Ćelij\\p{L}*"),
    E("ravna-gora", "/ravna-gora", "Ravn\\p{L}* [Gg]or\\p{L}*"),
    E("divcibare", "/divcibare", "Divčibar\\p{L}*"),
    E("mionica", "/mionica", "Mionic\\p{L}*"),
    E("struganik", "/struganik", "Struganik\\p{L}*"),
    E("rajac", "/rajac", "Rajcu", "Rajca", "Rajcem", "Rajac"),
    E("valjevo", "/okolina-turisticke-atrakcije", "Valjev\\p{L}*")
  ];
}

function generic(locale: Locale): Entry[] {
  if (locale === "en") {
    return [
      E("privatni-smestaj", "/smestaj/privatni-smestaj", "private accommodation"),
      E("smestaj", "/smestaj", "accommodation"),
      E("apartmani", "/smestaj/apartmani", "apartments"),
      E("vile", "/smestaj/vile", "villas"),
      E("sobe", "/smestaj/sobe", "rooms"),
      E("hoteli", "/smestaj/hoteli", "hotels"),
      E("bazeni", "/bazeni", "pools", "swimming pool\\p{L}*"),
      E("nekretnine", "/nekretnine", "real estate"),
      E("restorani", "/restorani", "restaurants"),
      E("manifestacije", "/manifestacije", "events")
    ];
  }
  if (locale === "de") {
    return [
      E("smestaj", "/smestaj", "Unterkunft\\p{L}*"),
      E("apartmani", "/smestaj/apartmani", "Apartments"),
      E("vile", "/smestaj/vile", "Villen"),
      E("sobe", "/smestaj/sobe", "Zimmer"),
      E("hoteli", "/smestaj/hoteli", "Hotels"),
      E("bazeni", "/bazeni", "Bäder", "Schwimmbäder", "Pools"),
      E("nekretnine", "/nekretnine", "Immobilien"),
      E("restorani", "/restorani", "Restaurants"),
      E("manifestacije", "/manifestacije", "Veranstaltungen")
    ];
  }
  // sr
  return [
    E("privatni-smestaj", "/smestaj/privatni-smestaj", "privatn\\p{L}* smeštaj\\p{L}*"),
    E("smestaj", "/smestaj", "smeštaj\\p{L}*"),
    E("apartmani", "/smestaj/apartmani", "apartman\\p{L}*"),
    E("vile", "/smestaj/vile", "vil[aeiou]\\p{L}*"),
    E("sobe", "/smestaj/sobe", "sob[aeiou]\\p{L}*"),
    E("hoteli", "/smestaj/hoteli", "hotel\\p{L}*"),
    E("bungalovi", "/smestaj/bungalovi", "bungalov\\p{L}*", "brvnar\\p{L}*"),
    E("vikendice", "/smestaj/vikendice", "vikendic\\p{L}*"),
    E("konaci", "/smestaj/konaci", "konac\\p{L}*", "konak\\p{L}*"),
    E("bazeni", "/bazeni", "bazen\\p{L}*"),
    E("lekovita-svojstva-banje", "/lekovita-svojstva-banje", "lekovit\\p{L}* (?:svojstv\\p{L}*|vod\\p{L}*)", "termomineraln\\p{L}* vod\\p{L}*", "mineraln\\p{L}* vod\\p{L}*"),
    E("istorijat-banje", "/istorijat-banje", "istorij\\p{L}*"),
    E("priroda-i-zdravlje", "/priroda-i-zdravlje", "priroda i zdravlje"),
    E("sport-i-rekreacija", "/sport-i-rekreacija", "sport\\p{L}* i rekreacij\\p{L}*", "rekreacij\\p{L}*"),
    E("fizikalna-terapija", "/fizikalna-terapija", "fizikaln\\p{L}* terapij\\p{L}*"),
    E("nekretnine", "/nekretnine", "nekretnin\\p{L}*"),
    E("restorani", "/restorani", "restoran\\p{L}*"),
    E("manifestacije", "/manifestacije", "manifestacij\\p{L}*")
  ];
}

// Spoljašnji linkovi: prva pojava datog teksta postaje <a> koji vodi na drugi sajt (novi tab).
const EXTERNAL: { href: string; rx: RegExp }[] = [
  { href: "https://mapa.in.rs", rx: new RegExp(`(?<![\\p{L}\\-/])mapa\\.in\\.rs(?![\\p{L}])`, "iu") }
];

// Pretvara običan tekst u čvorove sa internim linkovima (prva pojava svakog pojma, bez self-linka).
export function autoLink(text: string, locale: Locale, currentSlug?: string): React.ReactNode[] {
  const list = [...proper(), ...generic(locale)].filter((e) => e.base !== currentSlug);
  let nodes: React.ReactNode[] = [text];
  let k = 0;
  for (const e of list) {
    let done = false;
    nodes = nodes.flatMap((node): React.ReactNode[] => {
      if (done || typeof node !== "string") return [node];
      const m = e.rx.exec(node);
      if (!m) return [node];
      done = true;
      const before = node.slice(0, m.index);
      const hit = m[0];
      const after = node.slice(m.index + hit.length);
      const link = (
        <Link key={`al${k++}`} href={localeHref(e.path, locale)} className="text-brand hover:underline">{hit}</Link>
      );
      return [before, link, after].filter((x) => x !== "");
    });
  }
  // spoljašnji linkovi
  for (const ex of EXTERNAL) {
    let done = false;
    nodes = nodes.flatMap((node): React.ReactNode[] => {
      if (done || typeof node !== "string") return [node];
      const m = ex.rx.exec(node);
      if (!m) return [node];
      done = true;
      const before = node.slice(0, m.index);
      const hit = m[0];
      const after = node.slice(m.index + hit.length);
      const link = (
        <a key={`ex${k++}`} href={ex.href} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{hit}</a>
      );
      return [before, link, after].filter((x) => x !== "");
    });
  }
  return nodes;
}
