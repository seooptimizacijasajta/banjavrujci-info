"use client";
export default function FloatingButtons({ phone }: { phone?: string }) {
  if (!phone) return null;
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "381" + d.slice(1);
  if (!d) return null;
  return (
    <div className="fixed right-3 bottom-4 z-[90] flex flex-col gap-2 items-center">
      <span className="text-[10px] bg-slate-800 text-white rounded px-2 py-0.5">Vlasnik</span>
      <a href={`https://wa.me/${d}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg text-xl">✆</a>
      <a href={`viber://chat?number=%2B${d}`} aria-label="Viber"
        className="w-12 h-12 rounded-full bg-[#7360f2] text-white flex items-center justify-center shadow-lg text-xl">◉</a>
    </div>
  );
}
