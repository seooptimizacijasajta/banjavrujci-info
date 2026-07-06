"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function saveAvailability(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const listing_id = Number(formData.get("listing_id"));
  const slug = String(formData.get("slug") || "");
  let booked: string[] = [];
  try { booked = JSON.parse(String(formData.get("booked") || "[]")); } catch {}
  const today = new Date().toISOString().slice(0, 10);
  await supabase.from("listing_availability").delete().eq("listing_id", listing_id).gte("day", today);
  if (booked.length) {
    await supabase.from("listing_availability").insert(booked.map((d) => ({ listing_id, day: d, is_available: false })));
  }
  redirect(`/nalog/smestaj/${slug}/kalendar?saved=1`);
}
