import Link from "next/link";
import Image from "next/image";
import { getLocale, localeHref } from "@/lib/i18n";
export function Card({ l }: { l: any }) {
  const locale = getLocale();
  return (
    <Link href={localeHref(`/smestaj/${l.slug}`, locale)} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
      <div className="relative h-44 bg-slate-200">
        {l.image_url && <Image src={l.image_url} alt={l.title} fill className="object-cover" sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw" />}
      </div>
      <div className="p-4">
        <div className="text-xs uppercase text-brand font-semibold">{l.category}</div>
        <h3 className="font-semibold">{l.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2">{l.excerpt}</p>
        {l.price_text && <p className="text-sm font-semibold mt-2">{l.price_text}</p>}
      </div>
    </Link>
  );
}
export default Card;
