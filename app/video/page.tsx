import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VideoGallery from "@/components/VideoGallery";
import Sidebar from "@/components/Sidebar";
import { getDict, getLocale, localeHref } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export const metadata = { title: "Video — Banja Vrujci", description: "Video snimci i shorts iz Banje Vrujci — bazeni, smeštaj, priroda i okolina." };
function shuffle<T>(a: T[]): T[] { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export default async function VideoPage() {
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();
  const { data } = await supabase.from("videos").select("youtube_id,title,type");
  const all = data || [];
  const videos = shuffle(all.filter((v: any) => v.type === "video")).slice(0, 50);
  const shorts = shuffle(all.filter((v: any) => v.type === "short")).slice(0, 50);
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <div className="min-w-0 space-y-8">
        <nav className="text-sm text-slate-500"><Link href={localeHref("/", locale)} className="hover:text-brand">{t.nav.pocetna}</Link> / <span className="text-brand">{t.nav.video}</span></nav>
        <h1 className="text-3xl font-bold">{t.common.videoGalerijaTitle}</h1>
        <p className="text-slate-600">{t.common.videoGalerijaSubtitle}</p>
        <section><h2 className="text-xl font-bold mb-3">{t.nav.video}</h2><VideoGallery items={videos} /></section>
        <section><h2 className="text-xl font-bold mb-3">{t.common.shorts}</h2><VideoGallery items={shorts} /></section>
      </div>
      <Sidebar />
    </div>
  );
}
