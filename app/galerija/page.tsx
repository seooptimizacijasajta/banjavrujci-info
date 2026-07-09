import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import fotoManifest from "@/lib/foto-manifest.json";
import { getLocale, getDict, localeHref } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: "Galerija — Banja Vrujci", description: "Foto galerija Banje Vrujci: bazeni, priroda, okolina, manastiri, Rajac, Ravna Gora i znamenitosti." };
}
function cover(slug: string) {
  const f = (fotoManifest as Record<string, string[]>)[slug]?.[0];
  return f ? `/galerija/${slug}/${f}` : null;
}
export default async function Galerija() {
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();
  const { data: kids } = await supabase.from("pages").select("slug,title,excerpt").eq("parent_slug","galerija").eq("status","published").order("sort_order");
  const withImgs = (kids || []).filter((k: any) => cover(k.slug));
  const rest = (kids || []).filter((k: any) => !cover(k.slug));
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <div className="min-w-0 space-y-6">
        <nav className="text-sm text-slate-500"><Link href={localeHref("/", locale)} className="hover:text-brand">{t.nav.pocetna}</Link> / <span className="text-brand">{t.nav.galerija}</span></nav>
        <h1 className="text-3xl font-bold">{t.common.galerijaTitle}</h1>
        <p className="text-slate-600">{t.common.galerijaSubtitle}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withImgs.map((k: any) => (
            <Link key={k.slug} href={localeHref(`/${k.slug}`, locale)} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
              <div className="relative h-40 bg-slate-200"><Image src={cover(k.slug)!} alt={k.title} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" /></div>
              <div className="p-4"><h3 className="font-semibold">{k.title.replace(/^Banja Vrujci\s*/i,"").replace(/\s*[-–,].*$/,"")}</h3></div>
            </Link>
          ))}
        </div>
        {rest.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {rest.map((k: any) => <Link key={k.slug} href={localeHref(`/${k.slug}`, locale)} className="text-sm bg-brand/10 text-brand rounded-full px-3 py-1 hover:bg-brand hover:text-white">{k.title.replace(/^Banja Vrujci\s*/i,"").replace(/\s*[-–,].*$/,"")}</Link>)}
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
}
