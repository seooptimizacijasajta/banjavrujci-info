import PageView, { pageMeta } from "@/components/PageView";
export async function generateMetadata() { return pageMeta("nekretnine"); }
export default function Nekretnine() { return <PageView slug="nekretnine" />; }
