import { submitContact } from "@/app/actions/contact";
import type { Locale } from "@/lib/locale-path";

export default function ContactForm({ locale, sent, greska }: { locale: Locale; sent?: boolean; greska?: string }) {
  const L = (sr: string, en: string, de: string) => (locale === "en" ? en : locale === "de" ? de : sr);
  const a = 1 + Math.floor(Math.random() * 8);
  const b = 1 + Math.floor(Math.random() * 8);
  const errMsg =
    greska === "email" ? L("Unesite ispravan e-mail.", "Please enter a valid e-mail.", "Bitte gültige E-Mail eingeben.")
    : greska === "captcha" ? L("Netačan odgovor na pitanje. Pokušajte ponovo.", "Wrong answer to the question. Please try again.", "Falsche Antwort. Bitte erneut versuchen.")
    : greska === "cuvanje" ? L("Došlo je do greške. Pokušajte ponovo.", "Something went wrong. Please try again.", "Ein Fehler ist aufgetreten. Bitte erneut versuchen.")
    : greska ? L("Popunite ime, e-mail i poruku.", "Please fill in name, e-mail and message.", "Bitte Name, E-Mail und Nachricht ausfüllen.")
    : "";

  return (
    <section id="forma" className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{L("Pošaljite nam poruku", "Send us a message", "Senden Sie uns eine Nachricht")}</h2>
      {sent && <p className="mb-4 rounded bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">{L("Hvala! Vaša poruka je poslata. Javićemo vam se uskoro.", "Thank you! Your message has been sent. We'll get back to you soon.", "Danke! Ihre Nachricht wurde gesendet. Wir melden uns bald.")}</p>}
      {errMsg && <p className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{errMsg}</p>}

      <form action={submitContact} className="space-y-3">
        {/* Honeypot: sakriveno; ako ga bot popuni, poruka se odbacuje. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid sm:grid-cols-2 gap-3">
          <input name="name" required placeholder={L("Ime i prezime", "Full name", "Vor- und Nachname")} className="w-full border rounded px-3 py-2" />
          <input name="email" type="email" required placeholder="E-mail" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input name="phone" placeholder={L("Telefon (opciono)", "Phone (optional)", "Telefon (optional)")} className="w-full border rounded px-3 py-2" />
          <input name="subject" placeholder={L("Naslov (opciono)", "Subject (optional)", "Betreff (optional)")} className="w-full border rounded px-3 py-2" />
        </div>
        <textarea name="message" required rows={5} placeholder={L("Poruka", "Message", "Nachricht")} className="w-full border rounded px-3 py-2" />

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 whitespace-nowrap">{L(`Koliko je ${a} + ${b}?`, `What is ${a} + ${b}?`, `Wie viel ist ${a} + ${b}?`)}</label>
          <input name="captcha" required inputMode="numeric" aria-label="captcha" className="w-24 border rounded px-3 py-2" />
          <input type="hidden" name="captcha_expected" value={a + b} />
        </div>

        <button className="bg-brand text-white rounded px-6 py-2.5 font-semibold hover:bg-brand-dark">{L("Pošalji poruku", "Send message", "Nachricht senden")}</button>
      </form>
    </section>
  );
}
