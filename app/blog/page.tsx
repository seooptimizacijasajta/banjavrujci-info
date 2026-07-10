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
const PER_PAGE = 12;

const CATS: { slug: string; label: Record<string, string> }[] = [
  { slug: "sve", label: { sr: "Sve", en: "All", de: "Alle" } },
  { slug: "smestaj-vodici", label: { sr: "Smeštaj i vodiči", en: "Accommodation & guides", de: "Unterkunft & Ratgeber" } },
  { slug: "bazeni-wellness", label: { sr: "Bazeni i wellness", en: "Pools & wellness", de: "Bäder & Wellness" } },
  { slug: "manifestacije", label: { sr: "Manifestacije i događaji", en: "Events", de: "Veranstaltungen" } },
  { slug: "okolina-izleti", label: { sr: "Okolina i izleti", en: "Surroundings & trips", de: "Umgebung & Ausflüge" } },
  { slug: "banje-srbije", label: { sr: "Banje Srbije", en: "Spas of Serbia", de: "Kurorte Serbiens" } },
  { slug: "praznici", label: { sr: "Praznici", en: "Holidays", de: "Feiertage" } },
  { slug: "vesti", label: { sr: "Vesti", en: "News", de: "Nachrichten" } }
];

export default async function BlogList({ searchParams }: { searchParams: { tema?: string; strana?: string } }) {
  const locale = getLocale();
  const t = getDict(locale);
  const tag = LOCALE_TAG[locale] || "sr-RS";
  const activeCat = searchParams.tema && CATS.some((c) => c.slug === searchParams.tema) ? searchParams.tema : "sve";
  const page = Math.max(1, parseInt(searchParams.strana || "1", 10) || 1);

  const supabase = createClient();
  let query = supabase.from("posts").select("slug,title,excerpt,published_at,cover_url", { count: "exact" }).eq("status", "published");
  if (activeCat !== "sve") query = query.eq("category", activeCat);
  const from = (page - 1) * PER_PAGE;
  const { data: posts, count } = await query.order("published_at", { ascending: false }).range(from, from + PER_PAGE - 1);
  const totalPages = Math.max(1, Math.ceil((count || 0) / PER_PAGE));

  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString(tag, { year: "numeric", month: "long", day: "numeric" }) : "";
  const label = (c: { label: Record<string, string> }) => c.label[locale] || c.label.sr;
  const catHref = (slug: string) => slug === "sve" ? localeHref("/blog", locale) : `${localeHref("/blog", locale)}?tema=${slug}`;
  const pageHref = (p: number) => {
    const base = localeHref("/blog", locale);
    const q: string[] = [];
    if (activeCat !== "sve") q.push(`tema=${activeCat}`);
    if (p > 1) q.push(`strana=${p}`);
    return q.length ? `${base}?${q.join("&")}` : base;
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <div className="min-w-0">
        <nav className="text-sm text-slate-500 mb-2"><Link href={localeHref("/", locale)} className="hover:text-brand">{t.nav.pocetna}</Link> / <span className="text-brand">{t.nav.blog}</span></nav>
        <h1 className="text-3xl font-bold mb-2">{t.nav.blog}</h1>
        <p className="text-slate-600 mb-5">{t.common.blogPodnaslov}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATS.map((c) => (
            <Link key={c.slug} href={catHref(c.slug)}
              className={`text-sm rounded-full px-3 py-1.5 transition ${activeCat === c.slug ? "bg-brand text-white" : "bg-brand/10 text-brand hover:bg-brand hover:text-white"}`}>
              {label(c)}
            </Link>
          ))}
        </div>

        {(!posts || posts.length === 0) && <p className="text-slate-600">{t.common.blogPrazno}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          {(posts || []).map((p: any) => (
            <Link key={p.slug} href={localeHref(`/blog/${p.slug}`, locale)} className="block bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
              <div className="h-44 bg-slate-200">
                {p.cover_url && <img src={p.cover_url} alt={p.title} loading="lazy" className="w-full h-full object-cover" />}
              </div>
              <div className="p-5">
                <div className="text-xs text-slate-400 mb-1">{fmt(p.published_at)}</div>
                <h2 className="font-semibold text-lg mb-2 text-slate-800">{p.title}</h2>
                {p.excerpt && <p className="text-sm text-slate-600 line-clamp-3">{p.excerpt}</p>}
                <span className="inline-block mt-3 text-sm text-brand font-medium">{t.common.prociraj} →</span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-8">
            {page > 1 && <Link href={pageHref(page - 1)} className="px-3 py-1.5 rounded border border-slate-200 text-sm hover:bg-slate-50">←</Link>}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={pageHref(p)} className={`px-3 py-1.5 rounded text-sm ${p === page ? "bg-brand text-white" : "border border-slate-200 hover:bg-slate-50"}`}>{p}</Link>
            ))}
            {page < totalPages && <Link href={pageHref(page + 1)} className="px-3 py-1.5 rounded border border-slate-200 text-sm hover:bg-slate-50">→</Link>}
          </div>
        )}
      </div>
      <Sidebar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Blog", "name": "Banja Vrujci Blog", "url": localeUrl("/blog", locale), "inLanguage": locale,
        "blogPost": (posts || []).map((p: any) => ({ "@type": "BlogPosting", "headline": p.title, "url": localeUrl(`/blog/${p.slug}`, locale), "datePublished": p.published_at }))
      }) }} />
    </div>
  );
}
