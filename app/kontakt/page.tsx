import PageView, { pageMeta } from "@/components/PageView";
import ContactForm from "@/components/ContactForm";
import { getLocale } from "@/lib/i18n";

export async function generateMetadata() { return pageMeta("kontakt"); }

export default function Kontakt({ searchParams }: { searchParams: { sent?: string; greska?: string } }) {
  const locale = getLocale();
  return (
    <>
      <PageView slug="kontakt" />
      <ContactForm locale={locale} sent={searchParams?.sent === "1"} greska={searchParams?.greska} />
    </>
  );
}
