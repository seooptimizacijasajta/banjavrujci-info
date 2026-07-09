"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { passwordProblems } from "@/lib/password";

function siteOrigin() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signInWithProvider(provider: "google" | "facebook") {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteOrigin()}/auth/callback?next=/nalog` }
  });
  if (error) redirect("/login?err=" + encodeURIComponent(error.message));
  if (data?.url) redirect(data.url);
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const problems = passwordProblems(password);
  if (problems.length) redirect("/register?err=" + encodeURIComponent("Lozinka mora imati: " + problems.join(", ")));
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } }
  });
  if (error) redirect("/register?err=" + encodeURIComponent(error.message));
  redirect("/login?msg=" + encodeURIComponent("Proverite e-mail i potvrdite nalog pre prijave."));
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?err=" + encodeURIComponent(error.message));
  redirect("/nalog");
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) redirect("/zaboravljena-lozinka?err=" + encodeURIComponent("Unesite e-mail adresu."));
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteOrigin()}/auth/callback?next=/auth/reset`
  });
  if (error) redirect("/zaboravljena-lozinka?err=" + encodeURIComponent(error.message));
  redirect("/login?msg=" + encodeURIComponent("Ako nalog postoji, poslali smo vam link za resetovanje lozinke na e-mail."));
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const problems = passwordProblems(password);
  if (problems.length) redirect("/auth/reset?err=" + encodeURIComponent("Lozinka mora imati: " + problems.join(", ")));
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/auth/reset?err=" + encodeURIComponent(error.message));
  redirect("/login?msg=" + encodeURIComponent("Lozinka je uspešno promenjena. Možete se prijaviti."));
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
