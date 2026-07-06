"use client";
import { useState } from "react";

const WEEK = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
const MONTHS = ["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"];
const pad = (n: number) => String(n).padStart(2, "0");

function monthCells(year: number, month: number): (string | null)[] {
  const startDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= days; d++) cells.push(`${year}-${pad(month + 1)}-${pad(d)}`);
  return cells;
}

export default function AvailabilityCalendar({ booked, editable = false, listingId, slug, saveAction, months = 3 }:
  { booked: string[]; editable?: boolean; listingId?: number; slug?: string; saveAction?: (fd: FormData) => void; months?: number }) {
  const [sel, setSel] = useState<Set<string>>(new Set(booked));
  const today = `${new Date().getFullYear()}-${pad(new Date().getMonth() + 1)}-${pad(new Date().getDate())}`;
  const base = new Date(); base.setDate(1);
  const toggle = (day: string) => {
    if (!editable || day < today) return;
    const s = new Set(sel); s.has(day) ? s.delete(day) : s.add(day); setSel(s);
  };
  return (
    <div>
      <div className="flex flex-wrap gap-4 text-xs mb-3">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block"></span> Slobodno</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 border border-red-400 inline-block"></span> Zauzeto</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: months }).map((_, k) => {
          const d = new Date(base); d.setMonth(base.getMonth() + k);
          const y = d.getFullYear(), m = d.getMonth();
          return (
            <div key={k}>
              <div className="font-semibold text-center mb-2">{MONTHS[m]} {y}</div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400 mb-1">{WEEK.map((w) => <div key={w}>{w}</div>)}</div>
              <div className="grid grid-cols-7 gap-1">
                {monthCells(y, m).map((day, i) => {
                  if (!day) return <div key={i} />;
                  const past = day < today;
                  const isB = sel.has(day);
                  const cls = past ? "text-slate-300" : isB ? "bg-red-200 border-red-400 text-red-800" : "bg-emerald-50 border-emerald-200 text-slate-700";
                  return (
                    <button key={i} type="button" disabled={!editable || past} onClick={() => toggle(day)}
                      className={"h-8 rounded border text-xs " + cls + (editable && !past ? " hover:brightness-95 cursor-pointer" : " cursor-default")}>
                      {parseInt(day.slice(8))}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {editable && saveAction && (
        <form action={saveAction} className="mt-4">
          <input type="hidden" name="listing_id" value={listingId} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="booked" value={JSON.stringify([...sel])} />
          <button className="bg-brand text-white rounded px-5 py-2 font-semibold">Sačuvaj kalendar</button>
          <p className="text-xs text-slate-500 mt-1">Klik na datum menja status (slobodno ↔ zauzeto), pa Sačuvaj.</p>
        </form>
      )}
    </div>
  );
}
