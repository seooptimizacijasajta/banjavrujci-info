import PageView, { pageMeta } from "@/components/PageView";
export async function generateMetadata() { return pageMeta("kontakt"); }
export default function Kontakt() { return <PageView slug="kontakt" />; }
