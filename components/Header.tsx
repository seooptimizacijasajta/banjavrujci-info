"use client";
import Link from "next/link";
import { useState } from "react";

type Child = { label: string; href: string };
type Item = { label: string; href: string; children?: Child[] };

export default function Header({ email, role, signOut, menu }: { email: string | null; role: string | null; signOut: () => void; menu: Item[] }) {
  const [open, setOpen] = useState(false);
  const staff = role === "admin" || role === "superadmin";
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-[1380px] px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl text-brand shrink-0">Banja Vrujci</Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
          {menu.map((it) => it.children && it.children.length ? (
            <div key={it.label} className="relative group">
              <Link href={it.href} className="px-3 py-2 rounded hover:text-brand inline-flex items-center gap-1">{it.label}<span className="text-[10px]">▾</span></Link>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-lg border border-slate-100 py-2 w-64 z-50">
                {it.children.map((c) => <Link key={c.href} href={c.href} className="block px-4 py-1.5 text-sm hover:bg-slate-50 hover:text-brand">{c.label}</Link>)}
              </div>
            </div>
          ) : (
            <Link key={it.label} href={it.href} className="px-3 py-2 rounded hover:text-brand">{it.label}</Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3 text-sm shrink-0">
          {email ? (
            <>
              <Link href="/nalog" className="hover:text-brand">Moj panel</Link>
              {staff && <Link href="/admin" className="font-semibold text-brand">Admin</Link>}
              <form action={signOut}><button className="hover:text-brand">Odjava</button></form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand">Prijava</Link>
              <Link href="/register" className="hover:text-brand">Registracija</Link>
            </>
          )}
          <Link href="/nalog/smestaj/novi" className="bg-brand text-white rounded-full px-4 py-2 font-semibold hover:bg-brand-dark whitespace-nowrap">Dodaj smeštaj</Link>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Meni">
          <span className="block w-6 h-0.5 bg-slate-700 mb-1.5"></span>
          <span className="block w-6 h-0.5 bg-slate-700 mb-1.5"></span>
          <span className="block w-6 h-0.5 bg-slate-700"></span>
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-3 space-y-1 text-sm max-h-[80vh] overflow-y-auto">
          {menu.map((it) => (
            <div key={it.label}>
              <Link href={it.href} className="block py-1.5 font-semibold" onClick={() => setOpen(false)}>{it.label}</Link>
              {it.children?.map((c) => <Link key={c.href} href={c.href} className="block py-1 pl-4 text-slate-600" onClick={() => setOpen(false)}>{c.label}</Link>)}
            </div>
          ))}
          <hr className="my-2" />
          {email ? (
            <>
              <Link href="/nalog" className="block py-1.5" onClick={() => setOpen(false)}>Moj panel</Link>
              {staff && <Link href="/admin" className="block py-1.5 text-brand font-semibold" onClick={() => setOpen(false)}>Admin</Link>}
              <form action={signOut}><button className="py-1.5">Odjava</button></form>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-1.5" onClick={() => setOpen(false)}>Prijava</Link>
              <Link href="/register" className="block py-1.5" onClick={() => setOpen(false)}>Registracija</Link>
            </>
          )}
          <Link href="/nalog/smestaj/novi" className="block bg-brand text-white rounded px-4 py-2 font-semibold text-center mt-2" onClick={() => setOpen(false)}>Dodaj smeštaj</Link>
        </div>
      )}
    </header>
  );
}
