import Link from "next/link";
import galleryManifest from "@/lib/gallery-manifest.json";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import ListingMap from "@/components/ListingMap";
import Gallery from "@/components/Gallery";
import Sidebar from "@/components/Sidebar";
import FloatingButtons from "@/components/FloatingButtons";
import Stars from "@/components/Stars";
import ReviewForm from "@/components/ReviewForm";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { localizeRow, localizeRows } from "@/lib/translations";
import { autoLink } from "@/lib/autolink";
import { SITE_URL, localeUrl } from "@/lib/seo";

const CAT_TITLES: Record<string,string> = {
  apartmani:"Apartmani", vile:"Vile", sobe:"Sobe", kuce:"Kuće za odmor", bungalovi:"Brvnare i bungalovi",
  vikendice:"Vikendice", "privatni-smestaj":"Privatni smeštaj", hoteli:"Hoteli", konaci:"Konaci", "odmor-na-selu":"Odmor na selu"
};
const CATS = Object.keys(CAT_TITLES);
function catTitle(cat: string, dict: any) {
  return (dict.cats as Record<string,string>)[cat] ?? CAT_TITLES[cat] ?? cat;
}

function galleryImages(slug: string) {
  const files = (galleryManifest as Record<string, string[]>)[slug] || [];
  return files.map((f) => `/smestaj/gallery/${slug}/${f}`);
}
function waNumber(phone: string) {
  let d = (phone || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "381" + d.slice(1);
  return d;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const dict = getDict(locale);
  if (CATS.includes(params.slug)) {
    const ct = catTitle(params.slug, dict);
    return { title: `${ct} ${dict.listing.uBanji}`, description: `${ct} ${dict.listing.uBanji} — ${dict.nav.smestaj}.` };
  }
  const supabase = createClient();
  const { data } = await supabase.from("listings").select("id,title,meta_title,meta_description").eq("slug", params.slug).eq("status","approved").single();
  if (!data) return { title: "Smeštaj" };
  const d: any = await localizeRow("listing", data as any, locale);
  return { title: d.meta_title || d.title, description: d.meta_description || undefined };
}

export default async function SmestajSlug({ params, searchParams }: { params: { slug: string }; searchParams: { rev?: string } }) {
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();

  if (CATS.includes(params.slug)) {
    const { data: itemsRaw } = await supabase.from("listings")
      .select("id,title,slug,category,excerpt,image_url,price_text").eq("status","approved").eq("category", params.slug);
    const items = await localizeRows("listing", itemsRaw as any[], locale);
    return (
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
        <div>
          <nav className="text-sm text-slate-500 mb-2"><Link href={localeHref("/smestaj", locale)} className="hover:text-brand">{t.nav.smestaj}</Link> / <span className="text-brand">{catTitle(params.slug, t)}</span></nav>
          <h1 className="text-3xl font-bold mb-6">{catTitle(params.slug, t)} {t.listing.uBanji} <span className="text-slate-400 text-xl">({items?.length || 0})</span></h1>
          {(!items || items.length===0) && <p className="text-slate-600">{t.listing.nemaObjekata}</p>}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{items?.map((l:any)=> <Card key={l.id} l={l} />)}</div>
        </div>
        <Sidebar />
      </div>
    );
  }

  const { data: lraw } = await supabase.from("listings").select("*").eq("slug", params.slug).eq("status", "approved").single();
  if (!lraw) notFound();
  const l: any = await localizeRow("listing", lraw as any, locale);
  const { data: { user } } = await supabase.auth.getUser();
  const { data: reviews } = await supabase.from("reviews").select("rating,comment,created_at").eq("listing_id", l.id).eq("status", "approved").order("created_at", { ascending: false });
  const revCount = reviews?.length || 0;
  const avg = revCount ? (reviews as any[]).reduce((a, r) => a + r.rating, 0) / revCount : 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  const { data: av } = await supabase.from("listing_availability").select("day").eq("listing_id", l.id).eq("is_available", false).gte("day", todayStr);
  const bookedDays = (av || []).map((a: any) => a.day);
  const { data: relRaw } = await supabase.from("listings").select("id,title,slug,category,excerpt,image_url,price_text").eq("status","approved").eq("category", l.category).neq("slug", params.slug).limit(10);
  const related = await localizeRows("listing", (relRaw||[]).sort(()=>Math.random()-0.5).slice(0,3), locale);
  const gallery = galleryImages(params.slug);
  const wa = waNumber(l.phone || "");
  const canonical = localeUrl(`/smestaj/${params.slug}`, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LodgingBusiness",
        name: l.title,
        description: (l.excerpt || l.description || "").slice(0, 300),
        ...(l.image_url ? { image: SITE_URL + l.image_url } : {}),
        ...(l.phone ? { telephone: l.phone } : {}),
        url: canonical,
        ...(l.price_text ? { priceRange: l.price_text } : {}),
        address: { "@type": "PostalAddress", ...(l.address ? { streetAddress: l.address } : {}), addressLocality: "Banja Vrujci", addressCountry: "RS" },
        ...(l.latitude && l.longitude ? { geo: { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude } } : {})
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.nav.pocetna, item: localeUrl("/", locale) },
          { "@type": "ListItem", position: 2, name: t.nav.smestaj, item: localeUrl("/smestaj", locale) },
          { "@type": "ListItem", position: 3, name: catTitle(l.category, t), item: localeUrl(`/smestaj/${l.category}`, locale) },
          { "@type": "ListItem", position: 4, name: l.title, item: canonical }
        ]
      }
    ]
  };
  return (
    <div className="py-6 max-w-5xl mx-auto">
      <article className="space-y-6 min-w-0">
        <nav className="text-sm text-slate-500"><Link href={localeHref("/smestaj", locale)} className="hover:text-brand">{t.nav.smestaj}</Link> / <Link href={localeHref(`/smestaj/${l.category}`, locale)} className="hover:text-brand">{catTitle(l.category, t)}</Link></nav>
        <h1 className="text-3xl font-bold">{l.title}</h1>
        {revCount > 0 && <Stars value={avg} count={revCount} />}
        {searchParams.rev === "ok" && <p className="text-green-700 text-sm">{t.listing.hvala}</p>}
        {l.image_url && <img src={l.image_url} alt={l.title} className="w-full max-h-[440px] object-cover rounded-xl" />}

        {l.phone && (
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 flex flex-wrap items-center gap-3">
            <span className="font-semibold">{t.listing.kontakt}</span>
            <a href={`tel:${(l.phone||'').replace(/[^\d+]/g,'')}`} className="text-brand font-bold text-lg">{l.phone}</a>
            {wa && <a href={`viber://chat?number=%2B${wa}`} className="bg-[#7360f2] text-white rounded px-3 py-1.5 text-sm">Viber</a>}
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white rounded px-3 py-1.5 text-sm">WhatsApp</a>}
          </div>
        )}

        {l.description && <div className="whitespace-pre-line leading-relaxed text-slate-700">{autoLink(l.description, locale, params.slug)}</div>}

        {gallery.length > 0 && <Gallery images={gallery} title={l.title} />}

        {l.video_id && (
          <section>
            <h2 className="text-xl font-bold mb-3">{t.listing.video}</h2>
            <div className="aspect-video"><iframe className="w-full h-full rounded-xl" src={`https://www.youtube.com/embed/${l.video_id}`} title={l.title} allowFullScreen loading="lazy" /></div>
          </section>
        )}

        {l.latitude && l.longitude && (
          <section>
            <h2 className="text-xl font-bold mb-3">{t.listing.lokacija}</h2>
            <ListingMap markers={[{ lat: l.latitude, lng: l.longitude, title: l.title }]} zoom={15} />
            <p className="text-xs text-slate-500 mt-1">{t.listing.lokacijaNapomena}</p>
          </section>
        )}

        {related.length > 0 && (
          <section className="pt-2 border-t border-slate-100">
            <h2 className="text-xl font-bold mb-3">{t.listing.povezani}</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((r:any)=> <Card key={r.id} l={r} />)}
            </div>
          </section>
        )}
        <section className="pt-2 border-t border-slate-100">
          <h2 className="text-xl font-bold mb-3">{t.listing.dostupnost}</h2>
          <AvailabilityCalendar booked={bookedDays} months={2} />
        </section>

        <section className="pt-2 border-t border-slate-100">
          <h2 className="text-xl font-bold mb-3">{t.listing.oceneIUtisci}</h2>
          <div className="space-y-3 mb-4">
            {(reviews || []).map((r: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                <Stars value={r.rating} size="text-sm" />
                {r.comment && <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{r.comment}</p>}
              </div>
            ))}
            {revCount === 0 && <p className="text-slate-500 text-sm">{t.listing.nemaOcena}</p>}
          </div>
          {user ? <ReviewForm listingId={l.id} slug={params.slug} /> : <p className="text-sm text-slate-600">{t.listing.ostaviOcenuPre}<Link href={localeHref("/login", locale)} className="text-brand underline">{t.listing.prijaviteSe}</Link>{t.listing.ostaviOcenuPost}</p>}
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FloatingButtons phone={l.phone || undefined} />
    </div>
  );
}
