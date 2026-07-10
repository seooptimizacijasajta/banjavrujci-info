"use client";
import { usePathname } from "next/navigation";

// Strane koje već imaju desni sidebar sa izdvojenim smeštajem.
// Na njima ne prikazujemo blok iznad futera da se izdvojeni ne dupliraju.
const SIDEBAR_PREFIXES = ["/smestaj", "/kontakt", "/blog", "/galerija", "/manifestacije", "/video"];

export default function HideWhereSidebar({ children }: { children: React.ReactNode }) {
  let p = usePathname() || "/";
  // skloni prefiks jezika (/en, /de) da poređenje radi na svim jezicima
  p = p.replace(/^\/(en|de)(?=\/|$)/, "");
  if (p === "") p = "/";
  const hidden = p === "/" || SIDEBAR_PREFIXES.some((pre) => p === pre || p.startsWith(pre + "/"));
  return hidden ? null : <>{children}</>;
}
