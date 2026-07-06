import "./globals.css";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions/auth";
import Header from "@/components/Header";
import Izdvojeni from "@/components/Izdvojeni";
import HideOnHome from "@/components/HideOnHome";

export const metadata: Metadata = {
  title: {
    default: "Banja Vrujci — smeštaj, apartmani, vile i okolina",
    template: "%s | Banja Vrujci"
  },
  description:
    "Turistički portal Banje Vrujci: smeštaj (apartmani, vile, sobe, hoteli), termalni bazeni, okolina, manifestacije i vodič za odmor.",
  metadataBase: new URL("https://www.banjavrujci.info")
};

function shortLabel(title: string) {
  let t = title.replace(/^Banja Vrujci\s*/i, "").replace(/\s*[-–,].*$/, "").trim();
  if (!t) t = title;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const CATS: { label: string; href: string }[] = [
  { label: "Apartmani", href: "/smestaj/apartmani" },
  { label: "Vile", href: "/smestaj/vile" },
  { label: "Privatni smeštaj", href: "/smestaj/privatni-smestaj" },
  { label: "Brvnare i bungalovi", href: "/smestaj/bungalovi" },
  { label: "Sobe", href: "/smestaj/sobe" },
  { label: "Kuće", href: "/smestaj/kuce" },
  { label: "Vikendice", href: "/smestaj/vikendice" },
  { label: "Hoteli", href: "/smestaj/hoteli" }
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let role: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = data?.role ?? null;
  }
  const { data: pages } = await supabase.from("pages").select("slug,title,parent_slug,sort_order").eq("status","published").order("sort_order");
  const kids = (slug: string) => (pages || []).filter((p: any) => p.parent_slug === slug).map((p: any) => ({ label: shortLabel(p.title), href: `/${p.slug}` }));

  const menu = [
    { label: "Početna", href: "/" },
    { label: "Smeštaj", href: "/smestaj", children: CATS },
    { label: "O Banji", href: "/banja-vrujci", children: kids("banja-vrujci") },
    { label: "Nekretnine", href: "/nekretnine", children: kids("nekretnine") },
    { label: "Galerija", href: "/galerija", children: kids("galerija") },
    { label: "Video", href: "/video" },
    { label: "Blog", href: "/blog" },
    { label: "Info", href: "/info", children: kids("info") },
    { label: "Kontakt", href: "/kontakt" }
  ];

  return (
    <html lang="sr">
      <body className="overflow-x-hidden">
        <Header email={user?.email ?? null} role={role} signOut={signOut} menu={menu} />
        <main className="mx-auto max-w-[1380px] px-4 pb-6">{children}</main>
        <HideOnHome><div className="mx-auto max-w-[1380px] px-4 mt-8"><Izdvojeni /></div></HideOnHome>
        <footer className="mt-16 bg-slate-800 text-slate-300 text-sm">
          <div className="mx-auto max-w-[1380px] px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Kontakt</h4>
              <p>Turistički portal Banja Vrujci</p>
              <a href="tel:+381644598778" className="block text-white mt-1">+381 64 459 8778</a>
              <a href="mailto:info@banjavrujci.info" className="block break-all">info@banjavrujci.info</a>
              <div className="flex gap-2 mt-2">
                <a href="https://wa.me/381644598778" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white rounded px-3 py-1 text-xs">WhatsApp</a>
                <a href="viber://chat?number=%2B381644598778" className="bg-[#7360f2] text-white rounded px-3 py-1 text-xs">Viber</a>
              </div>
            </div>
            <div><h4 className="text-white font-semibold mb-2">Smeštaj</h4><p><a href="/smestaj/apartmani" className="hover:text-white">Apartmani</a> · <a href="/smestaj/vile" className="hover:text-white">Vile</a> · <a href="/smestaj/sobe" className="hover:text-white">Sobe</a> · <a href="/smestaj/hoteli" className="hover:text-white">Hoteli</a></p></div>
            <div><h4 className="text-white font-semibold mb-2">Okolina</h4><p><a href="/banja-vrujci" className="hover:text-white">O Banji</a> · <a href="/nekretnine" className="hover:text-white">Nekretnine</a> · <a href="/galerija" className="hover:text-white">Galerija</a></p></div>
            <div><h4 className="text-white font-semibold mb-2">Info</h4><p><a href="/info" className="hover:text-white">Info</a> · <a href="/blog" className="hover:text-white">Blog</a> · <a href="/kontakt" className="hover:text-white">Kontakt</a></p></div>
          </div>
          <div className="border-t border-slate-700 py-3 text-center text-xs">© 2026 Banja Vrujci · info@banjavrujci.info · +381 64 459 8778</div>
        </footer>
      </body>
    </html>
  );
}
