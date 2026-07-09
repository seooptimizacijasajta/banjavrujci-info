import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions/auth";
import Header from "@/components/Header";
import Izdvojeni from "@/components/Izdvojeni";
import HideOnHome from "@/components/HideOnHome";
import FooterBanners from "@/components/FooterBanners";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { SITE_URL, localeUrl, hreflangAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const t = getDict(locale);
  const basePath = headers().get("x-pathname") || "/";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.common.siteTitle, template: "%s | Banja Vrujci" },
    description: t.common.siteDescription,
    alternates: {
      canonical: localeUrl(basePath, locale),
      languages: hreflangAlternates(basePath)
    }
  };
}

function shortLabel(title: string) {
  let t = title.replace(/^Banja Vrujci\s*/i, "").replace(/\s*[-–,].*$/, "").trim();
  if (!t) t = title;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const CAT_KEYS = ["apartmani", "vile", "privatni-smestaj", "bungalovi", "sobe", "kuce", "vikendice", "hoteli"] as const;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const t = getDict(locale);
  const lh = (href: string) => localeHref(href, locale);

  const CATS = CAT_KEYS.map((k) => ({ label: t.cats[k], href: lh(`/smestaj/${k}`) }));
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let role: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = data?.role ?? null;
  }
  const { data: pages } = await supabase.from("pages").select("slug,title,parent_slug,sort_order").eq("status","published").order("sort_order");
  const kids = (slug: string) => (pages || []).filter((p: any) => p.parent_slug === slug).map((p: any) => ({ label: shortLabel(p.title), href: lh(`/${p.slug}`) }));

  const menu = [
    { label: t.nav.pocetna, href: lh("/") },
    { label: t.nav.smestaj, href: lh("/smestaj"), children: CATS },
    { label: t.nav.oBanji, href: lh("/banja-vrujci"), children: kids("banja-vrujci") },
    { label: t.nav.nekretnine, href: lh("/nekretnine"), children: kids("nekretnine") },
    { label: t.nav.galerija, href: lh("/galerija"), children: kids("galerija") },
    { label: t.nav.video, href: lh("/video") },
    { label: t.nav.blog, href: lh("/blog") },
    { label: t.nav.manifestacije, href: lh("/manifestacije") },
    { label: t.nav.info, href: lh("/info"), children: kids("info") },
    { label: t.nav.kontakt, href: lh("/kontakt") }
  ];

  return (
    <html lang={locale}>
      <body className="overflow-x-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": `${SITE_URL}/#website`, "url": SITE_URL, "name": "Banja Vrujci", "inLanguage": locale },
            { "@type": "Organization", "@id": `${SITE_URL}/#organization`, "name": t.footer.portal, "url": SITE_URL, "email": "info@banjavrujci.info", "telephone": "+381644598778" }
          ]
        }) }} />
        <Header email={user?.email ?? null} role={role} signOut={signOut} menu={menu} locale={locale} labels={t.auth} />
        <main className="mx-auto max-w-[1380px] px-4 pb-6">{children}</main>
        <HideOnHome><div className="mx-auto max-w-[1380px] px-4 mt-8"><Izdvojeni title={t.common.preporuceniSmestaj} /></div></HideOnHome>
        <footer className="mt-16 bg-slate-800 text-slate-300 text-sm">
          <div className="mx-auto max-w-[1380px] px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">{t.footer.kontakt}</h4>
              <p>{t.footer.portal}</p>
              <a href="tel:+381644598778" className="block text-white mt-1">+381 64 459 8778</a>
              <a href="mailto:info@banjavrujci.info" className="block break-all">info@banjavrujci.info</a>
              <div className="flex gap-2 mt-2">
                <a href="https://wa.me/381644598778" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white rounded px-3 py-1 text-xs">WhatsApp</a>
                <a href="viber://chat?number=%2B381644598778" className="bg-[#7360f2] text-white rounded px-3 py-1 text-xs">Viber</a>
              </div>
            </div>
            <div><h4 className="text-white font-semibold mb-2">{t.footer.smestaj}</h4><p><a href={lh("/smestaj/apartmani")} className="hover:text-white">{t.cats.apartmani}</a> · <a href={lh("/smestaj/vile")} className="hover:text-white">{t.cats.vile}</a> · <a href={lh("/smestaj/sobe")} className="hover:text-white">{t.cats.sobe}</a> · <a href={lh("/smestaj/hoteli")} className="hover:text-white">{t.cats.hoteli}</a></p></div>
            <div><h4 className="text-white font-semibold mb-2">{t.footer.okolina}</h4><p><a href={lh("/banja-vrujci")} className="hover:text-white">{t.footer.oBanji}</a> · <a href={lh("/nekretnine")} className="hover:text-white">{t.nav.nekretnine}</a> · <a href={lh("/galerija")} className="hover:text-white">{t.nav.galerija}</a></p></div>
            <div><h4 className="text-white font-semibold mb-2">{t.footer.info}</h4><p><a href={lh("/info")} className="hover:text-white">{t.nav.info}</a> · <a href={lh("/blog")} className="hover:text-white">{t.nav.blog}</a> · <a href={lh("/kontakt")} className="hover:text-white">{t.nav.kontakt}</a></p></div>
          </div>
          <FooterBanners />
          <div className="border-t border-slate-700 py-3 text-center text-xs">© 2026 Banja Vrujci · info@banjavrujci.info · +381 64 459 8778</div>
        </footer>
      </body>
    </html>
  );
}
