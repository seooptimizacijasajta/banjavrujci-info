"use client";
import Link from "next/link";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { localeHref, type Locale } from "@/lib/locale-path";

type Child = { label: string; href: string };
type Item = { label: string; href: string; children?: Child[] };
type AuthLabels = { mojPanel: string; admin: string; odjava: string; prijava: string; registracija: string; dodajSmestaj: string };

export default function Header({ email, role, signOut, menu, locale, labels }: { email: string | null; role: string | null; signOut: () => void; menu: Item[]; locale: Locale; labels: AuthLabels }) {
  const [open, setOpen] = useState(false);
  const staff = role === "admin" || role === "superadmin";
  const lh = (href: string) => localeHref(href, locale);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-[1380px] px-4 h-16 flex items-center justify-between">
        <Link href={lh("/")} className="font-extrabold text-xl text-brand shrink-0">Banja Vrujci</Link>
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
              <Link href={lh("/nalog")} className="hover:text-brand">{labels.mojPanel}</Link>
              {staff && <Link href={lh("/admin")} className="font-semibold text-brand">{labels.admin}</Link>}
              <form action={signOut}><button className="hover:text-brand">{labels.odjava}</button></form>
            </>
          ) : (
            <>
              <Link href={lh("/login")} className="hover:text-brand">{labels.prijava}</Link>
              <Link href={lh("/register")} className="hover:text-brand">{labels.registracija}</Link>
            </>
          )}
          <LanguageSwitcher current={locale} />
          <Link href={lh("/nalog/smestaj/novi")} className="bg-brand text-white rounded-full px-4 py-2 font-semibold hover:bg-brand-dark whitespace-nowrap">{labels.dodajSmestaj}</Link>
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
              <Link href={lh("/nalog")} className="block py-1.5" onClick={() => setOpen(false)}>{labels.mojPanel}</Link>
              {staff && <Link href={lh("/admin")} className="block py-1.5 text-brand font-semibold" onClick={() => setOpen(false)}>{labels.admin}</Link>}
              <form action={signOut}><button className="py-1.5">{labels.odjava}</button></form>
            </>
          ) : (
            <>
              <Link href={lh("/login")} className="block py-1.5" onClick={() => setOpen(false)}>{labels.prijava}</Link>
              <Link href={lh("/register")} className="block py-1.5" onClick={() => setOpen(false)}>{labels.registracija}</Link>
            </>
          )}
          <div className="py-2"><LanguageSwitcher current={locale} /></div>
          <Link href={lh("/nalog/smestaj/novi")} className="block bg-brand text-white rounded px-4 py-2 font-semibold text-center mt-2" onClick={() => setOpen(false)}>{labels.dodajSmestaj}</Link>
        </div>
      )}
    </header>
  );
}
