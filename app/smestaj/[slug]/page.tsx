import Link from "next/link";
import Image from "next/image";
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
import { SITE_URL, localeUrl, buildMeta } from "@/lib/seo";

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

function WaViber({ num }: { num: string }) {
  if (!num) return null;
  // Viber/WhatsApp samo za mobilne (srpski fiksni 381 + 1/2/3… nema; mobilni je 3816…). Strani brojevi = pretpostavi mobilni.
  const isMobile = !num.startsWith("381") || num.startsWith("3816");
  if (!isMobile) return null;
  return (
    <>
      <a href={`viber://chat?number=%2B${num}`} className="inline-flex items-center gap-1.5 bg-[#7360f2] text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        Viber</a>
      <a href={`https://wa.me/${num}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp</a>
    </>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const dict = getDict(locale);
  if (CATS.includes(params.slug)) {
    const ct = catTitle(params.slug, dict);
    return buildMeta({ title: `${ct} ${dict.listing.uBanji}`, description: `${ct} ${dict.listing.uBanji} — ${dict.nav.smestaj}.`, basePath: `/smestaj/${params.slug}`, locale });
  }
  const supabase = createClient();
  const { data } = await supabase.from("listings").select("id,title,excerpt,meta_title,meta_description,image_url").eq("slug", params.slug).eq("status","approved").single();
  if (!data) return { title: "Smeštaj" };
  const d: any = await localizeRow("listing", data as any, locale);
  return buildMeta({ title: d.meta_title || d.title, description: d.meta_description || d.excerpt || undefined, basePath: `/smestaj/${params.slug}`, locale, image: d.image_url, type: "article" });
}

export default async function SmestajSlug({ params, searchParams }: { params: { slug: string }; searchParams: { rev?: string } }) {
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();

  if (CATS.includes(params.slug)) {
    const { data: itemsRaw } = await supabase.from("listings")
      .select("id,title,slug,category,excerpt,image_url,price_text,phone,viber").eq("status","approved").eq("category", params.slug);
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
  const { data: relRaw } = await supabase.from("listings").select("id,title,slug,category,excerpt,image_url,price_text,phone,viber").eq("status","approved").eq("category", l.category).neq("slug", params.slug).limit(10);
  const related = await localizeRows("listing", (relRaw||[]).sort(()=>Math.random()-0.5).slice(0,3), locale);
  const gallery = galleryImages(params.slug);
  const wa = waNumber(l.phone || "");
  const wa2 = waNumber(l.viber || "");
  const contacts = [
    l.phone ? { display: String(l.phone), num: wa } : null,
    (l.viber && wa2 && wa2 !== wa) ? { display: String(l.viber), num: wa2 } : null
  ].filter(Boolean) as { display: string; num: string }[];
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
        {l.image_url && <Image src={l.image_url} alt={l.title} width={1200} height={630} priority className="w-full max-h-[440px] object-cover rounded-xl" />}

        {(contacts.length > 0 || l.email) && (
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 space-y-3">
            <span className="font-semibold">{t.listing.kontakt}</span>
            {contacts.map((c, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3">
                <a href={`tel:${c.display.replace(/[^\d+]/g, "")}`} className="text-brand font-bold text-lg">{c.display}</a>
                <WaViber num={c.num} />
              </div>
            ))}
            {l.email && <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 text-brand hover:underline"><span aria-hidden="true">✉</span>{l.email}</a>}
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
