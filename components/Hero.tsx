"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = ["/hero/1.jpg", "/hero/2.jpg", "/hero/3.jpg", "/hero/4.jpg", "/hero/5.jpg"];

export default function Hero({ count = 5 }: { count?: number }) {
  const slides = SLIDES.slice(0, count);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 h-[360px] sm:h-[440px] md:h-[520px] overflow-hidden">
      {slides.map((src, idx) => (
        <Image key={src} src={src} alt="Banja Vrujci" fill priority={idx === 0} sizes="100vw"
          className={"object-cover transition-opacity duration-1000 " + (idx === i ? "opacity-100" : "opacity-0")} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />

      <div className="relative z-10 h-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
        <p className="uppercase tracking-widest text-[11px] sm:text-sm text-teal-100 mb-2">Termalna oaza zapadne Srbije</p>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow mb-5 leading-tight">
          Banja Vrujci — smeštaj, bazeni i priroda
        </h1>
        <form action="/smestaj" className="w-full max-w-3xl bg-white/95 rounded-xl p-2 flex flex-col sm:flex-row gap-2 text-slate-700 shadow-lg">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
            <span className="text-brand">📅</span>
            <input type="date" name="from" aria-label="Dolazak" className="w-full outline-none bg-transparent text-sm" />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
            <span className="text-brand">📅</span>
            <input type="date" name="to" aria-label="Odlazak" className="w-full outline-none bg-transparent text-sm" />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
            <span className="text-brand">👤</span>
            <input type="number" min={1} name="guests" placeholder="Gosti" className="w-full outline-none bg-transparent text-sm" />
          </div>
          <button className="bg-brand text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-brand-dark whitespace-nowrap">Pronađi smeštaj</button>
        </form>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
          {slides.map((_, idx) => <span key={idx} className={"h-2 w-2 rounded-full " + (idx === i ? "bg-white" : "bg-white/50")} />)}
        </div>
      )}
    </section>
  );
}
