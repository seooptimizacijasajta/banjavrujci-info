"use client";
import { useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title?: string }) {
  const [idx, setIdx] = useState<number | null>(null);
  if (!images?.length) return null;
  const close = () => setIdx(null);
  const prev = () => setIdx((i) => (i === null ? i : (i + images.length - 1) % images.length));
  const next = () => setIdx((i) => (i === null ? i : (i + 1) % images.length));
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">Galerija</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((src, i) => (
          <button key={i} onClick={() => setIdx(i)} className="block h-40 rounded-lg overflow-hidden bg-slate-200">
            <img src={src} alt={`${title || "Slika"} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition" loading="lazy"
              onError={(e) => { const b = (e.currentTarget.closest("button")) as HTMLElement | null; if (b) b.style.display = "none"; }} />
          </button>
        ))}
      </div>
      {idx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4" onClick={close}>
          <button className="absolute top-4 right-5 text-white text-4xl" onClick={close} aria-label="Zatvori">×</button>
          <button className="absolute left-3 md:left-8 text-white text-4xl px-3" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Prethodna">‹</button>
          <img src={images[idx]} alt={`${title || "Slika"} ${idx + 1}`} className="max-h-[88vh] max-w-[92vw] object-contain rounded" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-3 md:right-8 text-white text-4xl px-3" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Sledeća">›</button>
        </div>
      )}
    </section>
  );
}
