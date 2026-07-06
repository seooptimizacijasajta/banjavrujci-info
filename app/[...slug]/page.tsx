import PageView, { pageMeta } from "@/components/PageView";
export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  return pageMeta(params.slug[params.slug.length - 1]);
}
export default function CatchAll({ params }: { params: { slug: string[] } }) {
  return <PageView slug={params.slug[params.slug.length - 1]} />;
}
