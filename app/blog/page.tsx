import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { localeUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Blog — Banja Vrujci",
  description: "Blog o Banji Vrujci: članci, vodiči i priče o banji, okolini, manastirima i banjskom turizmu u Srbiji."
};

const LOCALE_TAG: Record<string, string> = { sr: "sr-RS", en: "en-GB", de: "de-DE" };

export default async function BlogList() {
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts").select("slug,title,excerpt,published_at")
    .eq("status", "published").order("published_at", { ascending: false });
  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString(LOCALE_TAG[locale] || "sr-RS", { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <div className="min-w-0">
        <nav className="text-sm text-slate-500 mb-2"><Link href={localeHref("/", locale)} className="hover:text-brand">{t.nav.pocetna}</Link> / <span className="text-brand">{t.nav.blog}</span></nav>
        <h1 className="text-3xl font-bold mb-2">{t.nav.blog}</h1>
        <p className="text-slate-600 mb-6">{t.common.blogPodnaslov}</p>
        {(!posts || posts.length === 0) && <p className="text-slate-600">{t.common.blogPrazno}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          {(posts || []).map((p: any) => (
            <Link key={p.slug} href={localeHref(`/blog/${p.slug}`, locale)} className="block bg-white rounded-xl shadow hover:shadow-md transition p-5">
              <div className="text-xs text-slate-400 mb-1">{fmt(p.published_at)}</div>
              <h2 className="font-semibold text-lg mb-2 text-slate-800">{p.title}</h2>
              {p.excerpt && <p className="text-sm text-slate-600 line-clamp-3">{p.excerpt}</p>}
              <span className="inline-block mt-3 text-sm text-brand font-medium">{t.common.prociraj} →</span>
            </Link>
          ))}
        </div>
      </div>
      <Sidebar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Blog", "name": "Banja Vrujci Blog", "url": localeUrl("/blog", locale), "inLanguage": locale,
        "blogPost": (posts || []).slice(0, 25).map((p: any) => ({ "@type": "BlogPosting", "headline": p.title, "url": localeUrl(`/blog/${p.slug}`, locale), "datePublished": p.published_at }))
      }) }} />
    </div>
  );
}
