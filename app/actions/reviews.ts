"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const slug = String(formData.get("slug") || "");
  if (!user) redirect("/login?msg=" + encodeURIComponent("Prijavite se da biste ostavili ocenu."));
  const listing_id = Number(formData.get("listing_id"));
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") || "").trim();
  if (!rating || rating < 1 || rating > 5) redirect(`/smestaj/${slug}?rev=err`);
  const { error } = await supabase.from("reviews").insert({ listing_id, rating, comment });
  redirect(`/smestaj/${slug}?rev=` + (error ? "err" : "ok"));
}
export async function approveReview(fd: FormData) {
  const supabase = createClient();
  await supabase.from("reviews").update({ status: "approved" }).eq("id", Number(fd.get("id")));
  revalidatePath("/admin");
}
export async function rejectReview(fd: FormData) {
  const supabase = createClient();
  await supabase.from("reviews").update({ status: "rejected" }).eq("id", Number(fd.get("id")));
  revalidatePath("/admin");
}
