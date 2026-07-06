import Link from "next/link";
import galleryManifest from "@/lib/gallery-manifest.json";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "../../page";
import ListingMap from "@/components/ListingMap";
import Gallery from "@/components/Gallery";
import Sidebar from "@/components/Sidebar";
import FloatingButtons from "@/components/FloatingButtons";
import Stars from "@/components/Stars";
import ReviewForm from "@/components/ReviewForm";

const CAT_TITLES: Record<string,string> = {
  apartmani:"Apartmani", vile:"Vile", sobe:"Sobe", kuce:"Kuće za odmor", bungalovi:"Brvnare i bungalovi",
  vikendice:"Vikendice", "privatni-smestaj":"Privatni smeštaj", hoteli:"Hoteli", konaci:"Konaci", "odmor-na-selu":"Odmor na selu"
};
const CATS = Object.keys(CAT_TITLES);

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
  if (CATS.includes(params.slug)) {
    const t = CAT_TITLES[params.slug];
    return { title: `${t} u Banji Vrujci`, description: `${t} u Banji Vrujci — ponuda smeštaja, cene i kontakt.` };
  }
  const supabase = createClient();
  const { data } = await supabase.from("listings").select("title,meta_title,meta_description").eq("slug", params.slug).eq("status","approved").single();
  if (!data) return { title: "Smeštaj" };
  return { title: data.meta_title || data.title, description: data.meta_description || undefined };
}

export default async function SmestajSlug({ params, searchParams }: { params: { slug: string }; searchParams: { rev?: string } }) {
  const supabase = createClient();

  if (CATS.includes(params.slug)) {
    const { data: items } = await supabase.from("listings")
      .select("id,title,slug,category,excerpt,image_url,price_text").eq("status","approved").eq("category", params.slug);
    return (
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
        <div>
          <nav className="text-sm text-slate-500 mb-2"><Link href="/smestaj" className="hover:text-brand">Smeštaj</Link> / <span className="text-brand">{CAT_TITLES[params.slug]}</span></nav>
          <h1 className="text-3xl font-bold mb-6">{CAT_TITLES[params.slug]} u Banji Vrujci <span className="text-slate-400 text-xl">({items?.length || 0})</span></h1>
          {(!items || items.length===0) && <p className="text-slate-600">Trenutno nema objekata u ovoj kategoriji.</p>}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{items?.map((l:any)=> <Card key={l.id} l={l} />)}</div>
        </div>
        <Sidebar />
      </div>
    );
  }

  const { data: l } = await supabase.from("listings").select("*").eq("slug", params.slug).eq("status", "approved").single();
  if (!l) notFound();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: reviews } = await supabase.from("reviews").select("rating,comment,created_at").eq("listing_id", l.id).eq("status", "approved").order("created_at", { ascending: false });
  const revCount = reviews?.length || 0;
  const avg = revCount ? (reviews as any[]).reduce((a, r) => a + r.rating, 0) / revCount : 0;
  const { data: relRaw } = await supabase.from("listings").select("id,title,slug,category,excerpt,image_url,price_text").eq("status","approved").eq("category", l.category).neq("slug", params.slug).limit(10);
  const related = (relRaw||[]).sort(()=>Math.random()-0.5).slice(0,3);
  const gallery = galleryImages(params.slug);
  const wa = waNumber(l.phone || "");
  return (
    <div className="py-6 max-w-5xl mx-auto">
      <article className="space-y-6 min-w-0">
        <nav className="text-sm text-slate-500"><Link href="/smestaj" className="hover:text-brand">Smeštaj</Link> / <Link href={`/smestaj/${l.category}`} className="hover:text-brand">{CAT_TITLES[l.category] || l.category}</Link></nav>
        <h1 className="text-3xl font-bold">{l.title}</h1>
        {revCount > 0 && <Stars value={avg} count={revCount} />}
        {searchParams.rev === "ok" && <p className="text-green-700 text-sm">Hvala! Vaša ocena čeka odobrenje administratora.</p>}
        {l.image_url && <img src={l.image_url} alt={l.title} className="w-full max-h-[440px] object-cover rounded-xl" />}

        {l.phone && (
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 flex flex-wrap items-center gap-3">
            <span className="font-semibold">Kontakt:</span>
            <a href={`tel:${(l.phone||'').replace(/[^\d+]/g,'')}`} className="text-brand font-bold text-lg">{l.phone}</a>
            {wa && <a href={`viber://chat?number=%2B${wa}`} className="bg-[#7360f2] text-white rounded px-3 py-1.5 text-sm">Viber</a>}
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white rounded px-3 py-1.5 text-sm">WhatsApp</a>}
          </div>
        )}

        {l.description && <div className="whitespace-pre-line leading-relaxed text-slate-700">{l.description}</div>}

        {gallery.length > 0 && <Gallery images={gallery} title={l.title} />}

        {l.video_id && (
          <section>
            <h2 className="text-xl font-bold mb-3">Video</h2>
            <div className="aspect-video"><iframe className="w-full h-full rounded-xl" src={`https://www.youtube.com/embed/${l.video_id}`} title={l.title} allowFullScreen loading="lazy" /></div>
          </section>
        )}

        {l.latitude && l.longitude && (
          <section>
            <h2 className="text-xl font-bold mb-3">Lokacija na mapi</h2>
            <ListingMap markers={[{ lat: l.latitude, lng: l.longitude, title: l.title }]} zoom={15} />
            <p className="text-xs text-slate-500 mt-1">Napomena: prikazana lokacija je okvirna.</p>
          </section>
        )}

        {related.length > 0 && (
          <section className="pt-2 border-t border-slate-100">
            <h2 className="text-xl font-bold mb-3">Povezani smeštaj</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((r:any)=> <Card key={r.id} l={r} />)}
            </div>
          </section>
        )}
        <section className="pt-2 border-t border-slate-100">
          <h2 className="text-xl font-bold mb-3">Ocene i utisci</h2>
          <div className="space-y-3 mb-4">
            {(reviews || []).map((r: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                <Stars value={r.rating} size="text-sm" />
                {r.comment && <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{r.comment}</p>}
              </div>
            ))}
            {revCount === 0 && <p className="text-slate-500 text-sm">Još nema ocena — budite prvi.</p>}
          </div>
          {user ? <ReviewForm listingId={l.id} slug={params.slug} /> : <p className="text-sm text-slate-600">Da biste ostavili ocenu, <Link href="/login" className="text-brand underline">prijavite se</Link>.</p>}
        </section>
      </article>
      <FloatingButtons phone={l.phone || undefined} />
    </div>
  );
}
