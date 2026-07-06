import { createClient } from "@/lib/supabase/server";
import VideoGallery from "@/components/VideoGallery";
import Sidebar from "@/components/Sidebar";
export const dynamic = "force-dynamic";
export const metadata = { title: "Video — Banja Vrujci", description: "Video snimci i shorts iz Banje Vrujci — bazeni, smeštaj, priroda i okolina." };
function shuffle<T>(a: T[]): T[] { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export default async function VideoPage() {
  const supabase = createClient();
  const { data } = await supabase.from("videos").select("youtube_id,title,type");
  const all = data || [];
  const videos = shuffle(all.filter((v: any) => v.type === "video")).slice(0, 50);
  const shorts = shuffle(all.filter((v: any) => v.type === "short")).slice(0, 50);
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <div className="min-w-0 space-y-8">
        <h1 className="text-3xl font-bold">Video galerija Banje Vrujci</h1>
        <p className="text-slate-600">Snimci sa kanala @banjavrujci — bazeni, smeštaj, priroda i okolina. Prikaz se menja pri svakom otvaranju.</p>
        <section><h2 className="text-xl font-bold mb-3">Video</h2><VideoGallery items={videos} /></section>
        <section><h2 className="text-xl font-bold mb-3">Shorts</h2><VideoGallery items={shorts} /></section>
      </div>
      <Sidebar />
    </div>
  );
}
