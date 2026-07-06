"use client";
import { useEffect, useRef, useState } from "react";

const CATS = [
  ["apartmani","Apartmani"],["vile","Vile"],["sobe","Sobe"],["kuce","Kuće za odmor"],
  ["bungalovi","Bungalovi"],["vikendice","Vikendice"],["privatni-smestaj","Privatni smeštaj"],
  ["hoteli","Hoteli"],["odmor-na-selu","Odmor na selu"]
];

export default function ListingForm({ action, err }: { action: (fd: FormData) => void; err?: string }) {
  const [words, setWords] = useState(0);
  const [lat, setLat] = useState<number>(44.2607);
  const [lng, setLng] = useState<number>(20.1103);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = () => {
      const L = (window as any).L;
      if (!mapRef.current || (mapRef.current as any)._leaflet_id) return;
      const map = L.map(mapRef.current).setView([lat, lng], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current.on("dragend", (e: any) => { const p = e.target.getLatLng(); setLat(p.lat); setLng(p.lng); });
      map.on("click", (e: any) => { markerRef.current.setLatLng(e.latlng); setLat(e.latlng.lat); setLng(e.latlng.lng); });
    };
    document.body.appendChild(s);
  }, []);

  return (
    <form action={action} className="space-y-4 bg-white rounded-xl shadow p-6">
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div>
        <label className="block text-sm font-semibold mb-1">Naziv objekta *</label>
        <input name="title" required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Kategorija *</label>
        <select name="category" required className="w-full border rounded px-3 py-2">
          {CATS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Kratak opis (za karticu)</label>
        <input name="excerpt" className="w-full border rounded px-3 py-2" maxLength={200} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Detaljan opis * (min 700 reči)</label>
        <textarea name="description" required rows={12} onChange={(e) => setWords(e.target.value.trim().split(/\s+/).filter(Boolean).length)} className="w-full border rounded px-3 py-2" />
        <p className={"text-xs mt-1 " + (words >= 700 ? "text-green-700" : "text-red-600")}>Reči: {words} / 700</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-semibold mb-1">Cena (tekst)</label><input name="price_text" placeholder="npr. od 3.000 RSD / noć" className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-semibold mb-1">Telefon</label><input name="phone" className="w-full border rounded px-3 py-2" /></div>
      </div>
      <div><label className="block text-sm font-semibold mb-1">Adresa</label><input name="address" className="w-full border rounded px-3 py-2" /></div>
      <div>
        <label className="block text-sm font-semibold mb-1">Lokacija na mapi (klikni ili prevuci marker)</label>
        <div ref={mapRef} className="h-64 w-full rounded border" />
        <input type="hidden" name="latitude" value={lat} />
        <input type="hidden" name="longitude" value={lng} />
        <p className="text-xs text-slate-500 mt-1">Izabrano: {lat.toFixed(5)}, {lng.toFixed(5)}</p>
      </div>
      <div><label className="block text-sm font-semibold mb-1">Slike (URL-ovi, po jedan u redu)</label><textarea name="images" rows={3} className="w-full border rounded px-3 py-2" placeholder="https://...jpg" /></div>
      <div><label className="block text-sm font-semibold mb-1">Video linkovi (YouTube, do 3, po jedan u redu)</label><textarea name="videos" rows={3} className="w-full border rounded px-3 py-2" placeholder="https://youtu.be/..." /></div>
      <button className="bg-brand text-white rounded px-5 py-2 font-semibold">Pošalji na odobrenje</button>
    </form>
  );
}
