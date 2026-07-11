"use client";
import { useEffect, useState } from "react";

type Locale = "sr" | "en" | "de";

const LAT = 44.2669;
const LON = 20.0847;

const L = {
  sr: { title: "Vremenska prognoza", place: "Banja Vrujci", today: "Danas", wind: "Vetar", hum: "Vlažnost", err: "Prognoza trenutno nije dostupna." },
  en: { title: "Weather forecast", place: "Banja Vrujci", today: "Today", wind: "Wind", hum: "Humidity", err: "Forecast is currently unavailable." },
  de: { title: "Wettervorhersage", place: "Banja Vrujci", today: "Heute", wind: "Wind", hum: "Luftfeuchtigkeit", err: "Vorhersage derzeit nicht verfügbar." },
};

// WMO weather codes -> icon + trilingual description
function wx(code: number): { icon: string; sr: string; en: string; de: string } {
  const m: Record<number, [string, string, string, string]> = {
    0: ["☀️", "Vedro", "Clear sky", "Klar"],
    1: ["🌤️", "Pretežno vedro", "Mainly clear", "Überwiegend klar"],
    2: ["⛅", "Delimično oblačno", "Partly cloudy", "Teilweise bewölkt"],
    3: ["☁️", "Oblačno", "Overcast", "Bewölkt"],
    45: ["🌫️", "Magla", "Fog", "Nebel"],
    48: ["🌫️", "Ledena magla", "Rime fog", "Raureifnebel"],
    51: ["🌦️", "Slaba rosulja", "Light drizzle", "Leichter Nieselregen"],
    53: ["🌦️", "Rosulja", "Drizzle", "Nieselregen"],
    55: ["🌦️", "Jaka rosulja", "Dense drizzle", "Dichter Nieselregen"],
    61: ["🌧️", "Slaba kiša", "Light rain", "Leichter Regen"],
    63: ["🌧️", "Kiša", "Rain", "Regen"],
    65: ["🌧️", "Jaka kiša", "Heavy rain", "Starker Regen"],
    66: ["🌧️", "Ledena kiša", "Freezing rain", "Gefrierender Regen"],
    67: ["🌧️", "Jaka ledena kiša", "Heavy freezing rain", "Starker gefrierender Regen"],
    71: ["🌨️", "Slab sneg", "Light snow", "Leichter Schnee"],
    73: ["🌨️", "Sneg", "Snow", "Schnee"],
    75: ["❄️", "Jak sneg", "Heavy snow", "Starker Schnee"],
    77: ["🌨️", "Snežna zrna", "Snow grains", "Schneegriesel"],
    80: ["🌦️", "Pljuskovi", "Rain showers", "Regenschauer"],
    81: ["🌧️", "Jaki pljuskovi", "Heavy showers", "Starke Schauer"],
    82: ["⛈️", "Vrlo jaki pljuskovi", "Violent showers", "Heftige Schauer"],
    85: ["🌨️", "Snežni pljuskovi", "Snow showers", "Schneeschauer"],
    86: ["❄️", "Jaki snežni pljuskovi", "Heavy snow showers", "Starke Schneeschauer"],
    95: ["⛈️", "Grmljavina", "Thunderstorm", "Gewitter"],
    96: ["⛈️", "Grmljavina s gradom", "Thunderstorm, hail", "Gewitter mit Hagel"],
    99: ["⛈️", "Jaka grmljavina s gradom", "Severe thunderstorm, hail", "Schweres Gewitter mit Hagel"],
  };
  const v = m[code] || ["🌡️", "—", "—", "—"];
  return { icon: v[0], sr: v[1], en: v[2], de: v[3] };
}

export default function Weather({ locale = "sr" }: { locale?: Locale }) {
  const t = L[locale] || L.sr;
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&timezone=Europe%2FBelgrade&forecast_days=5`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setErr(true));
  }, []);

  if (err) return null;

  const dayName = (iso: string) => {
    const loc = locale === "sr" ? "sr-RS" : locale === "de" ? "de-DE" : "en-GB";
    return new Date(iso + "T12:00:00").toLocaleDateString(loc, { weekday: "short" });
  };

  const cur = data?.current;
  const curWx = cur ? wx(cur.weather_code) : null;
  const curDesc = curWx ? curWx[locale] : "";
  const days = data?.daily?.time?.slice(1) || []; // od sutra

  return (
    <section className="mx-auto max-w-[1380px] px-4 mt-10">
      <div className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-200 bg-gradient-to-br from-sky-500 via-sky-500 to-cyan-500 text-white">
        <div className="flex flex-col md:flex-row">
          {/* Trenutno vreme */}
          <div className="p-5 md:p-6 md:w-[320px] shrink-0 md:border-r border-white/20">
            <div className="text-xs uppercase tracking-wide text-white/80">{t.title}</div>
            <div className="text-lg font-semibold">{t.place}</div>
            {cur ? (
              <div className="mt-3 flex items-center gap-3">
                <div className="text-5xl leading-none">{curWx?.icon}</div>
                <div>
                  <div className="text-4xl font-bold leading-none">{Math.round(cur.temperature_2m)}°</div>
                  <div className="text-sm text-white/90">{curDesc}</div>
                </div>
              </div>
            ) : (
              <div className="mt-3 h-14 w-40 rounded bg-white/20 animate-pulse" />
            )}
            {cur && (
              <div className="mt-3 flex gap-4 text-xs text-white/85">
                <span>💨 {t.wind} {Math.round(cur.wind_speed_10m)} km/h</span>
                <span>💧 {t.hum} {cur.relative_humidity_2m}%</span>
              </div>
            )}
          </div>
          {/* Prognoza 4 dana */}
          <div className="flex-1 grid grid-cols-4 divide-x divide-white/15 bg-white/5">
            {days.length > 0
              ? days.map((iso: string, i: number) => {
                  const w = wx(data.daily.weather_code[i + 1]);
                  return (
                    <div key={iso} className="p-4 text-center">
                      <div className="text-xs font-semibold uppercase text-white/85 capitalize">{dayName(iso)}</div>
                      <div className="text-3xl my-1">{w.icon}</div>
                      <div className="text-sm font-semibold">{Math.round(data.daily.temperature_2m_max[i + 1])}°</div>
                      <div className="text-xs text-white/75">{Math.round(data.daily.temperature_2m_min[i + 1])}°</div>
                    </div>
                  );
                })
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4"><div className="h-16 rounded bg-white/15 animate-pulse" /></div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
