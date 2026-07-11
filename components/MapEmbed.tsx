export default function MapEmbed({ src, title = "Mapa" }: { src: string; title?: string }) {
  return (
    <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-sm">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="w-full h-[300px] sm:h-[440px] border-0 block"
      />
    </div>
  );
}
