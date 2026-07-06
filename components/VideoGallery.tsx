"use client";
import { useState } from "react";
type V = { youtube_id: string; title?: string | null };
export default function VideoGallery({ items }: { items: V[] }) {
  const [active, setActive] = useState<string | null>(null);
  if (!items?.length) return null;
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((v) => (
          <button key={v.youtube_id} onClick={() => setActive(v.youtube_id)} className="group text-left">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200">
              <img src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`} alt={v.title || "Video"} className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" />
              <span className="absolute inset-0 flex items-center justify-center"><span className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center text-xl">▶</span></span>
            </div>
            {v.title && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{v.title}</p>}
          </button>
        ))}
      </div>
      {active && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <button className="absolute top-4 right-5 text-white text-4xl" onClick={() => setActive(null)} aria-label="Zatvori">×</button>
          <div className="w-full max-w-3xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe className="w-full h-full rounded" src={`https://www.youtube.com/embed/${active}?autoplay=1`} title="Video" allow="autoplay; fullscreen" allowFullScreen />
          </div>
        </div>
      )}
    </>
  );
}
