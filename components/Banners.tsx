import Link from "next/link";

export default function Banners() {
  return (
    <section className="grid gap-4 md:grid-cols-3 -mt-2">
      {/* 1. Zeleni — Banja Vrujci */}
      <div className="rounded-xl p-5 bg-brand text-white flex flex-col">
        <h3 className="text-lg font-bold mb-2"><span className="text-white">BANJA</span> VRUJCI</h3>
        <p className="text-sm text-teal-50 flex-1">
          Turistički portal Banja Vrujci — sve potrebne informacije o banji na jednom mestu.
        </p>
        <Link href="/banja-vrujci" className="mt-4 inline-block bg-white text-brand font-semibold rounded px-4 py-2 text-sm w-fit hover:bg-teal-50">
          Saznajte o banji
        </Link>
      </div>

      {/* 2. Beli — Smeštaj */}
      <div className="rounded-xl p-5 bg-white border border-slate-200 text-slate-700 flex flex-col shadow-sm">
        <h3 className="text-lg font-bold mb-2"><span className="text-brand">SMEŠTAJ</span> BANJA VRUJCI</h3>
        <p className="text-sm text-slate-600 flex-1">
          Ponuda smeštaja — vile, apartmani, hoteli, sobe, privatni smeštaj.
        </p>
        <Link href="/smestaj" className="mt-4 inline-block bg-brand text-white font-semibold rounded px-4 py-2 text-sm w-fit hover:bg-brand-dark">
          Smeštaj u Banji Vrujci
        </Link>
      </div>

      {/* 3. Zeleni — Nekretnine */}
      <div className="rounded-xl p-5 bg-brand text-white flex flex-col">
        <h3 className="text-lg font-bold mb-2"><span className="text-white">NEKRETNINE</span> BANJA VRUJCI</h3>
        <p className="text-sm text-teal-50 flex-1">
          Ponuda nekretnina — apartmani, kuće, vikendice, placevi, stanovi, poslovni prostor.
        </p>
        <Link href="/nekretnine" className="mt-4 inline-block bg-white text-brand font-semibold rounded px-4 py-2 text-sm w-fit hover:bg-teal-50">
          Sve nekretnine
        </Link>
      </div>
    </section>
  );
}
