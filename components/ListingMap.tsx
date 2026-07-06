"use client";
import { useEffect, useRef } from "react";

type Marker = { lat: number; lng: number; title?: string; href?: string };

export default function ListingMap({ markers, zoom = 14, height = "360px" }: { markers: Marker[]; zoom?: number; height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!markers?.length) return;
    let map: any;
    const ensureCss = () => {
      if (!document.getElementById("leaflet-css")) {
        const l = document.createElement("link");
        l.id = "leaflet-css"; l.rel = "stylesheet";
        l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(l);
      }
    };
    const init = () => {
      const L = (window as any).L;
      if (!ref.current || (ref.current as any)._leaflet_id) return;
      const center: [number, number] = [markers[0].lat, markers[0].lng];
      map = L.map(ref.current, { scrollWheelZoom: false }).setView(center, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap", maxZoom: 19 }).addTo(map);
      const group: any[] = [];
      markers.forEach((m) => {
        const mk = L.marker([m.lat, m.lng]).addTo(map);
        if (m.title) {
          const html = m.href ? `<a href="${m.href}" style="color:#159e8c;font-weight:600">${m.title}</a>` : m.title;
          mk.bindPopup(html);
        }
        group.push(mk);
      });
      if (markers.length > 1) {
        const fg = L.featureGroup(group);
        map.fitBounds(fg.getBounds().pad(0.2));
      }
    };
    ensureCss();
    if ((window as any).L) { init(); }
    else {
      let s = document.getElementById("leaflet-js") as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement("script");
        s.id = "leaflet-js"; s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.body.appendChild(s);
      }
      s.addEventListener("load", init);
    }
    return () => { if (map) map.remove(); };
  }, [markers, zoom]);

  if (!markers?.length) return null;
  return <div ref={ref} style={{ height }} className="w-full rounded-xl border border-slate-200 z-0" />;
}
