import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { saveAvailability } from "@/app/actions/availability";
export const dynamic = "force-dynamic";
export const metadata = { title: "Kalendar dostupnosti" };
export default async function KalendarPage({ params, searchParams }: { params: { slug: string }; searchParams: { saved?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: l } = await supabase.from("listings").select("id,title,slug").eq("slug", params.slug).single();
  if (!l) notFound();
  const today = new Date().toISOString().slice(0, 10);
  const { data: av } = await supabase.from("listing_availability").select("day").eq("listing_id", l.id).eq("is_available", false).gte("day", today);
  const booked = (av || []).map((a: any) => a.day);
  return (
    <div className="py-6 max-w-4xl">
      <nav className="text-sm text-slate-500 mb-2"><Link href="/nalog" className="hover:text-brand">Moj panel</Link> / <span className="text-brand">Kalendar</span></nav>
      <h1 className="text-2xl font-bold mb-1">Kalendar dostupnosti — {l.title}</h1>
      {searchParams.saved && <p className="text-green-700 text-sm mb-3">Kalendar je sačuvan.</p>}
      <p className="text-slate-600 text-sm mb-4">Klikni na datume koji su zauzeti (crveno), pa Sačuvaj. Ostali datumi su slobodni.</p>
      <AvailabilityCalendar booked={booked} editable listingId={l.id} slug={l.slug} saveAction={saveAvailability} months={4} />
    </div>
  );
}
