import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { localizeRows } from "@/lib/translations";

export default async function Sidebar() {
  noStore();
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();
  const { data: feat } = await supabase.from("listings")
    .select("id,slug,title,category,image_url").eq("status","approved").eq("promo_tier","featured");
  const shuffled = await localizeRows("listing", (feat || []).sort(() => Math.random() - 0.5).slice(0, 9), locale);
  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-bold mb-3">{t.common.izdvojeniSmestaj}</h3>
        <div className="space-y-3">
          {shuffled.map((l: any) => (
            <Link key={l.slug} href={localeHref(`/smestaj/${l.slug}`, locale)} className="flex gap-3 items-center group">
              <div className="w-16 h-14 rounded bg-slate-200 overflow-hidden shrink-0">
                {l.image_url && <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" loading="lazy" />}
              </div>
              <div className="text-sm">
                <div className="font-semibold group-hover:text-brand leading-tight">{l.title}</div>
                <div className="text-xs text-slate-500 uppercase">{l.category}</div>
              </div>
            </Link>
          ))}
        </div>
        <Link href={localeHref("/smestaj", locale)} className="block mt-3 text-sm text-brand font-semibold">{t.common.savSmestaj} →</Link>
      </div>
      <Link href={localeHref("/kontakt", locale)} className="block bg-brand text-white rounded-xl p-4 text-center font-semibold hover:bg-brand-dark">{t.common.kontakt}</Link>
      <div className="text-[11px] text-slate-400 leading-relaxed">SEO optimizacija sajta banjavrujci.info · smeštaj u Banji Vrujci · apartmani u Banji Vrujci · Banja Vrujci</div>
    </aside>
  );
}
