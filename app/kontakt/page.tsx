import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import ContactForm from "@/components/ContactForm";
import { pageMeta } from "@/components/PageView";
import { getLocale, getDict, localeHref } from "@/lib/i18n";

export async function generateMetadata() { return pageMeta("kontakt"); }

const SITES = [
  "https://www.banjavrujci.info", "https://www.vrujci.org", "https://www.banja-vrujci.co.rs",
  "https://www.banja-vrujci.net", "https://www.banja-vrujci.org", "https://www.banjavrujci.biz"
];
const SOCIAL: { label: string; href: string }[] = [
  { label: "Facebook", href: "https://www.facebook.com/Banja.Vrujci/" },
  { label: "Facebook grupa", href: "https://www.facebook.com/groups/banjavrujcismestaj" },
  { label: "TikTok", href: "https://www.tiktok.com/@banjavrujci" },
  { label: "Instagram", href: "https://www.instagram.com/Banja.Vrujci" },
  { label: "X (Twitter)", href: "https://twitter.com/banjavrujci" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/banja-vrujci" },
  { label: "Pinterest", href: "https://www.pinterest.com/banjavrujci/banja-vrujci/" },
  { label: "YouTube", href: "https://youtube.com/c/BanjavrujciInfoSmestajApartmani" },
  { label: "Threads", href: "https://www.threads.com/@banja.vrujci" }
];

export default function Kontakt({ searchParams }: { searchParams: { sent?: string; greska?: string } }) {
  const locale = getLocale();
  const t = getDict(locale);
  const L = (sr: string, en: string, de: string) => (locale === "en" ? en : locale === "de" ? de : sr);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <div className="min-w-0 space-y-5">
        <nav className="text-sm text-slate-500"><Link href={localeHref("/", locale)} className="hover:text-brand">{t.nav.pocetna}</Link> / <span className="text-brand">{t.nav.kontakt}</span></nav>
        <h1 className="text-3xl font-bold">{t.nav.kontakt}</h1>
        <Image src="/galerija/banja-vrujci-fotografije/34.jpg" alt="Banja Vrujci" width={1200} height={630} priority className="w-full max-h-[320px] object-cover rounded-xl" />

        <p className="text-slate-700 leading-relaxed">
          {L(
            "Poštovani posetioci portala, sa ove stranice nas možete kontaktirati u vezi svega što ima veze sa smeštajem u Banji Vrujci, marketingom Vašeg smeštaja ili nečim drugim. Na uvredljive, glupe i omalovažavajuće poruke ne odgovaramo. Ako želite da i Vaša ponuda bude postavljena na naše sajtove i društvene mreže, pišite nam ovde (popunite kontakt formular) ili na ",
            "Dear portal visitors, from this page you can contact us about anything related to accommodation in Banja Vrujci, marketing your accommodation, or anything else. We do not reply to offensive, silly or disparaging messages. If you would like your offer to appear on our websites and social networks, write to us here (fill in the contact form) or on ",
            "Sehr geehrte Besucher des Portals, über diese Seite können Sie uns zu allem rund um Unterkünfte in Banja Vrujci, das Marketing Ihrer Unterkunft oder anderes kontaktieren. Auf beleidigende, dumme oder herabwürdigende Nachrichten antworten wir nicht. Wenn Sie möchten, dass auch Ihr Angebot auf unseren Websites und in sozialen Netzwerken erscheint, schreiben Sie uns hier (Kontaktformular ausfüllen) oder unter "
          )}
          <a href="tel:+381644598778" className="text-brand font-medium">064 4598778</a> (Viber/WhatsApp).
        </p>

        <div>
          <h2 className="font-semibold text-slate-800 mb-1">{L("Naši sajtovi:", "Our websites:", "Unsere Websites:")}</h2>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {SITES.map((u) => (
              <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{u.replace("https://", "")}</a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-slate-800 mb-2">{L("Društvene mreže:", "Social networks:", "Soziale Netzwerke:")}</h2>
          <div className="flex flex-wrap gap-2">
            {SOCIAL.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm bg-brand/10 text-brand rounded-full px-3 py-1 hover:bg-brand hover:text-white">{s.label}</a>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
          {L(
            "Do sada smo prodali dosta kuća, stanova, placeva i drugih nekretnina, a vlasnici smeštaja su prezadovoljni reklamom — samo na Facebook-u imamo oko 45.000 pratilaca u grupi i na strani, a na Instagramu blizu 12.000.",
            "So far we have sold many houses, flats, plots and other properties, and accommodation owners are delighted with the promotion — on Facebook alone we have around 45,000 followers across the group and page, and nearly 12,000 on Instagram.",
            "Bisher haben wir viele Häuser, Wohnungen, Grundstücke und andere Immobilien verkauft, und die Unterkunftseigentümer sind mit der Werbung sehr zufrieden — allein auf Facebook haben wir rund 45.000 Follower in Gruppe und Seite und fast 12.000 auf Instagram."
          )}
        </p>

        <ContactForm locale={locale} sent={searchParams?.sent === "1"} greska={searchParams?.greska} />
      </div>
      <Sidebar />
    </div>
  );
}
