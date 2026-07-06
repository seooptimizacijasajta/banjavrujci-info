"use client";
import { useState } from "react";

type QA = { question: string; answer: string };

export default function Faq({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!items?.length) return null;
  return (
    <section className="pt-4">
      <h2 className="text-2xl font-bold mb-4">Često postavljana pitanja</h2>
      <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
        {items.map((it, i) => (
          <div key={i}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 text-left px-4 py-3 hover:bg-slate-50">
              <span className="font-semibold text-slate-800">{it.question}</span>
              <span className="text-brand text-xl leading-none shrink-0">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div className="px-4 pb-4 text-slate-700 leading-relaxed whitespace-pre-line">{it.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
