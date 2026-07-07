import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/Card";
import ListingMap from "@/components/ListingMap";
import Sidebar from "@/components/Sidebar";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { localizeRows } from "@/lib/translations";
export const metadata = {
  title: "Smeštaj u Banji Vrujci — apartmani, vile, sobe, hoteli",
  description: "Ponuda smeštaja u Banji Vrujci: apartmani, vile, sobe, kuće, bungalovi, hoteli i privatni smeštaj."
};
const CAT_TITLES: Record<string,string> = {
  apartmani:"Apartmani", vile:"Vile", sobe:"Sobe", kuce:"Kuće za odmor", bungalovi:"Brvnare i bungalovi",
  vikendice:"Vikendice", "privatni-smestaj":"Privatni smeštaj", hoteli:"Hoteli", konaci:"Konaci", "odmor-na-selu":"Odmor na selu"
};
const ORDER = ["apartmani","vile","privatni-smestaj","sobe","bungalovi","konaci","vikendice","kuce","hoteli","odmor-na-selu"];
export default async function Smestaj() {
  const locale = getLocale();
  const t = getDict(locale);
  const catTitle = (c: string) => (t.cats as Record<string,string>)[c] ?? CAT_TITLES[c] ?? c;
  const supabase = createClient();
  const { data: listingsRaw } = await supabase
    .from("listings").select("id,title,slug,category,excerpt,image_url,price_text,latitude,longitude")
    .eq("status","approved");
  const listings = await localizeRows("listing", listingsRaw || [], locale);
  const byCat: Record<string, any[]> = {};
  (listings||[]).forEach((l:any)=>{ (byCat[l.category] ||= []).push(l); });
  const cats = ORDER.filter(c=>byCat[c]?.length);
  const markers = (listings||[]).filter((l:any)=>l.latitude&&l.longitude).map((l:any)=>({lat:l.latitude,lng:l.longitude,title:l.title,href:localeHref(`/smestaj/${l.slug}`, locale)}));
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold mb-2">{t.common.smestajUBanji}</h1>
        <p className="text-slate-600 mb-6">{t.listing.smestajSubtitle.replace("{n}", String(listings?.length || 0))}</p>
        {markers.length>0 && (<div className="mb-8"><h2 className="text-xl font-bold mb-3">{t.listing.smestajNaMapi}</h2><ListingMap markers={markers} zoom={14} height="420px" /></div>)}
        {cats.length===0 && <p className="text-slate-600">{t.listing.nemaObjavljenih}</p>}
        <div className="space-y-10">
          {cats.map((c)=>(
            <section key={c}>
              <h2 className="text-2xl font-bold mb-4">{catTitle(c)} <span className="text-slate-400 text-lg">({byCat[c].length})</span></h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {byCat[c].map((l:any)=> <Card key={l.id} l={l} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
