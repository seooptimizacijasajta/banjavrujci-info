import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Faq from "@/components/Faq";
import Sidebar from "@/components/Sidebar";
import Gallery from "@/components/Gallery";
import fotoManifest from "@/lib/foto-manifest.json";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { localizeRow, localizeRows } from "@/lib/translations";
import { localeUrl } from "@/lib/seo";

function short(t: string) { return t.replace(/^Banja Vrujci\s*/i, "").replace(/\s*[-–,].*$/, ""); }

const GAL_FILTER: Record<string, RegExp> = {
  "bazeni-fotografije": /bazen|akva|jakuzi|most|igrali|vodeni/i,
  "fotografije-ribnica": /ribnica/i,
  "rajac-fotografije": /rajac/i,
  "ravna-gora-fotografije": /ravna/i,
  "struganik-fotografije": /struganik/i,
  "manastir-celije-fotografije": /celije/i,
  "manastir-lelic-fotografije": /lelic/i
};

export async function pageMeta(slug: string) {
  const locale = getLocale();
  const supabase = createClient();
  const { data } = await supabase.from("pages").select("id,title,meta_title,meta_description").eq("slug", slug).eq("status","published").single();
  if (!data) return { title: "Stranica" };
  const d: any = await localizeRow("page", data as any, locale);
  return { title: d.meta_title || d.title, description: d.meta_description || undefined };
}

export default async function PageView({ slug }: { slug: string }) {
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();
  const { data: pageRaw } = await supabase.from("pages").select("*").eq("slug", slug).eq("status","published").single();
  if (!pageRaw) notFound();
  const page: any = await localizeRow("page", pageRaw as any, locale);
  const [{ data: kidsRaw }, { data: faqs }, { data: parent }, { data: siblingsRaw }] = await Promise.all([
    supabase.from("pages").select("id,slug,title,excerpt,image_url").eq("parent_slug", slug).eq("status","published").order("sort_order"),
    supabase.from("faqs").select("question,answer,sort_order").eq("entity_type","page").eq("entity_id", page.id).eq("locale", locale).order("sort_order"),
    page.parent_slug ? supabase.from("pages").select("slug,title").eq("slug", page.parent_slug).single() : Promise.resolve({ data: null } as any),
    page.parent_slug ? supabase.from("pages").select("id,slug,title").eq("parent_slug", page.parent_slug).eq("status","published").neq("slug", slug).order("sort_order").limit(10) : Promise.resolve({ data: [] } as any)
  ]);
  const kids = await localizeRows("page", kidsRaw as any[], locale);
  const siblings = await localizeRows("page", siblingsRaw as any[], locale);
  let faqRows: any[] = faqs || [];
  if (faqRows.length === 0 && locale !== "sr") {
    const { data } = await supabase.from("faqs").select("question,answer,sort_order").eq("entity_type","page").eq("entity_id", page.id).eq("locale","sr").order("sort_order");
    faqRows = data || [];
  }
  const faqItems = faqRows.map((f: any) => ({ question: f.question, answer: f.answer }));

  const isGal = page.section === "galerija";
  const galFiles = (fotoManifest as Record<string, string[]>)[slug] || [];
  const galImgs = galFiles.map((f) => `/galerija/${slug}/${f}`);
  const showHeader = page.image_url && !isGal;
  const cleanContent = (page.content || "").replace(/https?:\/\/\S*rockettheme\S*/g, "").replace(/https?:\/\/www\.banjavrujci\.info\/wp-content\/\S+/g, "").replace(/\n{3,}/g, "\n\n").trim();

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <article className="space-y-6 min-w-0">
        <nav className="text-sm text-slate-500">
          <Link href={localeHref("/", locale)} className="hover:text-brand">{t.nav.pocetna}</Link>
          {parent && <> / <Link href={localeHref(`/${(parent as any).slug}`, locale)} className="hover:text-brand">{short((parent as any).title)}</Link></>}
        </nav>
        <h1 className="text-3xl font-bold">{page.title}</h1>
        {showHeader && <img src={page.image_url} alt={page.title} className="w-full max-h-[420px] object-cover rounded-xl" />}
        {cleanContent && <div className="whitespace-pre-line leading-relaxed text-slate-700">{cleanContent}</div>}

        {(kids && kids.length > 0) && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {kids.map((k: any) => (
              <Link key={k.slug} href={localeHref(`/${k.slug}`, locale)} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                {k.image_url && <div className="h-36 bg-slate-200"><img src={k.image_url} alt={k.title} className="w-full h-full object-cover" loading="lazy" /></div>}
                <div className="p-4"><h3 className="font-semibold">{short(k.title)}</h3>{k.excerpt && <p className="text-sm text-slate-600 line-clamp-2">{k.excerpt}</p>}</div>
              </Link>
            ))}
          </div>
        )}

        {isGal && (galImgs.length > 0 ? <Gallery images={galImgs} title={short(page.title)} /> : <p className="text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-4">{t.listing.galerijaUskoro}</p>)}

        <Faq items={faqItems} />
        {faqItems.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context":"https://schema.org","@type":"FAQPage",
            "mainEntity": faqItems.map((f) => ({ "@type":"Question","name":f.question,"acceptedAnswer":{"@type":"Answer","text":f.answer} }))
          }) }} />
        )}

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", position: 1, name: t.nav.pocetna, item: localeUrl("/", locale) },
            ...(parent ? [{ "@type": "ListItem", position: 2, name: short((parent as any).title), item: localeUrl(`/${(parent as any).slug}`, locale) }] : []),
            { "@type": "ListItem", position: parent ? 3 : 2, name: short(page.title), item: localeUrl(`/${slug}`, locale) }
          ]
        }) }} />

        {siblings && siblings.length > 0 && (
          <section className="pt-2 border-t border-slate-100">
            <h2 className="text-lg font-bold mb-3">{t.listing.povezaneStranice}</h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((sp: any) => <Link key={sp.slug} href={localeHref(`/${sp.slug}`, locale)} className="text-sm bg-brand/10 text-brand rounded-full px-3 py-1 hover:bg-brand hover:text-white">{short(sp.title)}</Link>)}
            </div>
          </section>
        )}
      </article>
      <Sidebar />
    </div>
  );
}
