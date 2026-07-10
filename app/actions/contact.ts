"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM = process.env.CONTACT_FROM || "Banja Vrujci <kontakt@banjavrujci.info>";
const CONTACT_TO = process.env.CONTACT_TO || "banjavrujci@gmail.com";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function notifyEmail(d: { name: string; email: string; phone: string; subject: string; message: string }) {
  if (!RESEND_API_KEY) return; // Nema ključa -> preskoči slanje (poruka je već sačuvana u bazi).
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: d.email,
        subject: `Nova poruka sa sajta${d.subject ? " — " + d.subject : ""} (${d.name})`,
        html: `
          <h2>Nova poruka sa kontakt forme</h2>
          <p><strong>Ime:</strong> ${esc(d.name)}</p>
          <p><strong>E-mail:</strong> ${esc(d.email)}</p>
          ${d.phone ? `<p><strong>Telefon:</strong> ${esc(d.phone)}</p>` : ""}
          ${d.subject ? `<p><strong>Naslov:</strong> ${esc(d.subject)}</p>` : ""}
          <p><strong>Poruka:</strong></p>
          <p style="white-space:pre-line">${esc(d.message)}</p>
        `
      })
    });
  } catch {
    // Slanje mejla nije uspelo, ali je poruka sačuvana u bazi — ne prekidamo tok.
  }
}

export async function submitContact(formData: FormData) {
  const honeypot = String(formData.get("website") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const captcha = String(formData.get("captcha") || "").trim();
  const expected = String(formData.get("captcha_expected") || "").trim();

  // Bot popunio skriveno polje -> tiho se pravimo da je poslato, ne upisujemo.
  if (honeypot) redirect("/kontakt?sent=1");
  if (!name || !email || !message) redirect("/kontakt?greska=polja#forma");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) redirect("/kontakt?greska=email#forma");
  if (parseInt(captcha, 10) !== parseInt(expected, 10)) redirect("/kontakt?greska=captcha#forma");

  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name, email, phone: phone || null, subject: subject || null, message
  });
  if (error) redirect("/kontakt?greska=cuvanje#forma");

  await notifyEmail({ name, email, phone, subject, message });
  redirect("/kontakt?sent=1#forma");
}
