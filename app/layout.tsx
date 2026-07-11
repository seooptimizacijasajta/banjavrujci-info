import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions/auth";
import Header from "@/components/Header";
import Izdvojeni from "@/components/Izdvojeni";
import HideWhereSidebar from "@/components/HideWhereSidebar";
import Weather from "@/components/Weather";
import FooterBanners from "@/components/FooterBanners";
import FooterSocial from "@/components/FooterSocial";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { SITE_URL, localeUrl, hreflangAlternates, absUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";

const OG_LOCALE: Record<string, string> = { sr: "sr_RS", en: "en_US", de: "de_DE" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const t = getDict(locale);
  const basePath = headers().get("x-pathname") || "/";
  const url = localeUrl(basePath, locale);
  const img = absUrl(DEFAULT_OG_IMAGE);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.common.siteTitle, template: "%s | Banja Vrujci" },
    description: t.common.siteDescription,
    alternates: {
      canonical: url,
      languages: hreflangAlternates(basePath)
    },
    openGraph: {
      title: t.common.siteTitle,
      description: t.common.siteDescription,
      url,
      siteName: "Banja Vrujci",
      type: "website",
      locale: OG_LOCALE[locale] || "sr_RS",
      alternateLocale: (["sr", "en", "de"] as const).filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: img, width: 1200, height: 630, alt: t.common.siteTitle }]
    },
    twitter: { card: "summary_large_image", title: t.common.siteTitle, description: t.common.siteDescription, images: [img] }
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
        <HideWhereSidebar><div className="mx-auto max-w-[1380px] px-4 mt-8"><Izdvojeni title={t.common.preporuceniSmestaj} /></div></HideWhereSidebar>
        <Weather locale={locale} />
        <footer className="mt-16 bg-slate-900 text-slate-300 text-sm">
          <div className="h-1 bg-brand" />
          <div className="mx-auto max-w-[1380px] px-4 py-10 grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <div className="text-white text-xl font-extrabold tracking-tight">Banja Vrujci</div>
              <p className="text-brand font-medium mt-0.5">{t.footer.portal}</p>
              <p className="text-slate-400 mt-3 leading-relaxed max-w-sm">{t.footer.tagline}</p>
              <div className="mt-4 space-y-1.5">
                <a href="tel:+381644598778" className="flex items-center gap-2 text-white hover:text-brand"><span className="text-slate-500">{t.footer.telefon}:</span> +381 64 459 8778</a>
                <a href="mailto:info@banjavrujci.info" className="flex items-center gap-2 hover:text-white break-all"><span className="text-slate-500">E-mail:</span> info@banjavrujci.info</a>
              </div>
              <div className="flex gap-2 mt-4">
                <a href="https://wa.me/381644598778" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white rounded px-3 py-1.5 text-xs font-medium">WhatsApp</a>
                <a href="viber://chat?number=%2B381644598778" className="bg-[#7360f2] text-white rounded px-3 py-1.5 text-xs font-medium">Viber</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{t.footer.smestaj}</h4>
              <ul className="space-y-2">
                {(["apartmani","vile","privatni-smestaj","sobe","bungalovi","hoteli"] as const).map((k) => (
                  <li key={k}><a href={lh(`/smestaj/${k}`)} className="hover:text-white">{t.cats[k]}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{t.footer.otkrijte}</h4>
              <ul className="space-y-2">
                <li><a href={lh("/banja-vrujci")} className="hover:text-white">{t.footer.oBanji}</a></li>
                <li><a href={lh("/nekretnine")} className="hover:text-white">{t.nav.nekretnine}</a></li>
                <li><a href={lh("/galerija")} className="hover:text-white">{t.nav.galerija}</a></li>
                <li><a href={lh("/video")} className="hover:text-white">{t.nav.video}</a></li>
                <li><a href={lh("/manifestacije")} className="hover:text-white">{t.nav.manifestacije}</a></li>
                <li><a href={lh("/blog")} className="hover:text-white">{t.nav.blog}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{t.footer.info}</h4>
              <ul className="space-y-2">
                <li><a href={lh("/info")} className="hover:text-white">{t.nav.info}</a></li>
                <li><a href={lh("/kontakt")} className="hover:text-white">{t.nav.kontakt}</a></li>
                <li><a href={lh("/oglasi")} className="hover:text-white">Oglasi</a></li>
                <li><a href={lh("/prijatelji-portala")} className="hover:text-white">Prijatelji portala</a></li>
                <li><a href={lh("/uslovi-koriscenja")} className="hover:text-white">Uslovi korišćenja</a></li>
              </ul>
            </div>
          </div>
          <div className="mx-auto max-w-[1380px] px-4 pb-6 border-t border-slate-800 pt-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-slate-500 text-xs max-w-2xl">{t.footer.trust}</p>
              <FooterSocial />
            </div>
          </div>
          <FooterBanners />
          <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Banja Vrujci · {t.footer.portal} · {t.footer.svaPrava}
          </div>
        </footer>
      </body>
    </html>
  );
}
