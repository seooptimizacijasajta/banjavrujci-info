"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(s: string) {
  const map: Record<string, string> = { š:"s", đ:"dj", č:"c", ć:"c", ž:"z", Š:"s", Đ:"dj", Č:"c", Ć:"c", Ž:"z" };
  return s.replace(/[šđčćžŠĐČĆŽ]/g, m => map[m] || m)
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
function wordCount(s: string) { return s.trim().split(/\s+/).filter(Boolean).length; }

export async function createListing(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const price_text = String(formData.get("price_text") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const latitude = parseFloat(String(formData.get("latitude") || "")) || null;
  const longitude = parseFloat(String(formData.get("longitude") || "")) || null;
  const images = String(formData.get("images") || "").split(/\n+/).map(s => s.trim()).filter(Boolean);
  const videos = String(formData.get("videos") || "").split(/\n+/).map(s => s.trim()).filter(Boolean).slice(0, 3);

  if (wordCount(description) < 700) {
    redirect("/nalog/smestaj/novi?err=" + encodeURIComponent("Opis mora imati najmanje 700 reči (trenutno " + wordCount(description) + ")."));
  }

  const slug = slugify(title) + "-" + Math.random().toString(36).slice(2, 6);
  const { data: listing, error } = await supabase.from("listings").insert({
    title, category, description, excerpt, price_text, phone, address, latitude, longitude,
    slug, status: "pending",
    meta_title: title + " — Banja Vrujci",
    meta_description: excerpt || (title + " u Banji Vrujci.")
  }).select("id").single();
  if (error) redirect("/nalog/smestaj/novi?err=" + encodeURIComponent(error.message));

  if (images.length) {
    await supabase.from("listing_images").insert(images.map((url, i) => ({ listing_id: listing!.id, url, sort_order: i, alt_text: title })));
  }
  for (let i = 0; i < videos.length; i++) {
    const url = videos[i];
    const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/);
    await supabase.from("listing_videos").insert({ listing_id: listing!.id, youtube_url: url, youtube_id: m?.[1] ?? null, sort_order: i });
  }
  redirect("/nalog?msg=" + encodeURIComponent("Objekat je poslat na odobrenje."));
}

export async function approveListing(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = createClient();
  await supabase.from("listings").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/");
}
export async function rejectListing(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = createClient();
  await supabase.from("listings").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin");
}
