import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { approveListing, rejectListing } from "@/app/actions/listings";
import { approveReview, rejectReview } from "@/app/actions/reviews";
export const metadata = { title: "Admin" };
export default async function Admin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!me || !["admin","superadmin"].includes(me.role)) redirect("/");
  const { data: pending } = await supabase.from("listings").select("id,title,category,slug,created_at").eq("status","pending").order("created_at");
  const { data: pendingReviews } = await supabase.from("reviews").select("id,rating,comment,listing_id,listings(title)").eq("status","pending").order("created_at");
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Objekti na čekanju</h1>
      {(!pending || pending.length===0) && <p className="text-slate-600">Nema objekata na čekanju.</p>}
      <div className="space-y-3">
        {pending?.map((l: any) => (
          <div key={l.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div><div className="font-semibold">{l.title}</div><div className="text-xs uppercase text-slate-500">{l.category}</div></div>
            <div className="flex gap-2">
              <form action={approveListing}><input type="hidden" name="id" value={l.id} /><button className="bg-green-600 text-white rounded px-3 py-1 text-sm">Odobri</button></form>
              <form action={rejectListing}><input type="hidden" name="id" value={l.id} /><button className="bg-red-600 text-white rounded px-3 py-1 text-sm">Odbij</button></form>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-10 mb-5">Ocene na čekanju</h2>
      {(!pendingReviews || pendingReviews.length===0) && <p className="text-slate-600">Nema ocena na čekanju.</p>}
      <div className="space-y-3">
        {pendingReviews?.map((r: any) => (
          <div key={r.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-3">
            <div><div className="text-amber-400">{"★".repeat(r.rating)}<span className="text-slate-300">{"★".repeat(5-r.rating)}</span></div><div className="text-sm font-semibold">{r.listings?.title}</div>{r.comment && <div className="text-sm text-slate-600">{r.comment}</div>}</div>
            <div className="flex gap-2 shrink-0">
              <form action={approveReview}><input type="hidden" name="id" value={r.id} /><button className="bg-green-600 text-white rounded px-3 py-1 text-sm">Odobri</button></form>
              <form action={rejectReview}><input type="hidden" name="id" value={r.id} /><button className="bg-red-600 text-white rounded px-3 py-1 text-sm">Odbij</button></form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}