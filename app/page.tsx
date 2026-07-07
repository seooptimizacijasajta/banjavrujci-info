import Link from "next/link";
import { Card } from "@/components/Card";
import Hero from "@/components/Hero";
import Banners from "@/components/Banners";
import Izdvojeni from "@/components/Izdvojeni";
import Izdvojeni2 from "@/components/Izdvojeni2";
import CategoryRow from "@/components/CategoryRow";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getDict, localeHref } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Home() {
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("id,title,slug,category,excerpt,price_text,promo_tier,image_url")
    .eq("status", "approved");
  const all = listings || [];
  const featured = shuffle(all.filter((l: any) => l.promo_tier === "premium"));
  const highlighted = shuffle(all.filter((l: any) => l.promo_tier === "featured"));
  const rest = shuffle(all.filter((l: any) => l.promo_tier === "none")).slice(0, 12);
  return (
    <div className="space-y-10">
      <Hero count={5} />
      <Banners />
      <Izdvojeni />
      <Izdvojeni2 />
      <CategoryRow />
      {featured.length > 0 && <ListSection title={t.common.preporuceniSmestaj} items={featured} />}
      {highlighted.length > 0 && <ListSection title={t.common.izdvojeniSmestaj} items={highlighted} />}
      {rest.length > 0 && <ListSection title={t.common.smestajUBanji} items={rest} />}
      <div className="text-center"><Link href={localeHref("/smestaj", locale)} className="inline-block bg-brand text-white rounded px-6 py-3 font-semibold hover:bg-brand-dark">{t.common.pogledajSav}</Link></div>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: any[] }) {
  if (!items?.length) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => <Card key={l.id} l={l} />)}
      </div>
    </section>
  );
}
