import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export const metadata = { title: "Moj panel" };
const STATUS: Record<string,string> = { draft:"Nacrt", pending:"Na čekanju", approved:"Odobreno", rejected:"Odbijeno" };
export default async function Nalog({ searchParams }: { searchParams: { msg?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: listings } = await supabase.from("listings").select("id,title,slug,category,status").order("created_at", { ascending: false });
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Moji objekti</h1>
        <Link href="/nalog/smestaj/novi" className="bg-brand text-white rounded px-4 py-2 font-semibold">+ Dodaj smeštaj</Link>
      </div>
      {searchParams.msg && <p className="mb-4 text-green-700 text-sm">{searchParams.msg}</p>}
      {(!listings || listings.length === 0) && <p className="text-slate-600">Još nemaš dodatih objekata.</p>}
      <div className="space-y-3">
        {listings?.map((l: any) => (
          <div key={l.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div><div className="font-semibold">{l.title}</div><div className="text-xs uppercase text-slate-500">{l.category}</div></div>
            <div className="flex items-center gap-3"><Link href={`/nalog/smestaj/${l.slug}/kalendar`} className="text-sm text-brand hover:underline">Kalendar</Link><span className={"text-xs px-2 py-1 rounded " + (l.status==="approved"?"bg-green-100 text-green-800":l.status==="pending"?"bg-amber-100 text-amber-800":l.status==="rejected"?"bg-red-100 text-red-800":"bg-slate-100 text-slate-700")}>{STATUS[l.status]}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
