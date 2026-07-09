import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import { getLocale, getDict, localeHref } from "@/lib/i18n";
import { SITE_URL, localeUrl, buildMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";
const LOCALE_TAG: Record<string, string> = { sr: "sr-RS", en: "en-GB", de: "de-DE" };

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const supabase = createClient();
  const { data } = await supabase.from("posts").select("title,excerpt,cover_url").eq("slug", params.slug).eq("status", "published").single();
  if (!data) return { title: "Blog — Banja Vrujci" };
  return buildMeta({ title: `${data.title} — Blog`, description: data.excerpt || undefined, basePath: `/blog/${params.slug}`, locale, image: data.cover_url, type: "article" });
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const t = getDict(locale);
  const supabase = createClient();
  const { data: post } = await supabase.from("posts").select("*").eq("slug", params.slug).eq("status", "published").single();
  if (!post) notFound();
  const { data: more } = await supabase.from("posts").select("slug,title,published_at").eq("status", "published").neq("slug", params.slug).order("published_at", { ascending: false }).limit(6);
  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString(LOCALE_TAG[locale] || "sr-RS", { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 py-6">
      <article className="min-w-0 space-y-5">
        <nav className="text-sm text-slate-500">
          <Link href={localeHref("/", locale)} className="hover:text-brand">{t.nav.pocetna}</Link> / <Link href={localeHref("/blog", locale)} className="hover:text-brand">{t.nav.blog}</Link>
        </nav>
        <header>
          <h1 className="text-3xl font-bold mb-1">{post.title}</h1>
          <div className="text-sm text-slate-400">{t.common.objavljeno}: {fmt(post.published_at)}</div>
        </header>
        {post.cover_url && <Image src={post.cover_url} alt={post.title} width={1200} height={630} priority className="w-full max-h-[420px] object-cover rounded-xl" />}
        <div
          className="max-w-none leading-relaxed text-slate-700 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h4]:font-semibold [&_h4]:mt-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:text-brand [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_blockquote]:border-l-4 [&_blockquote]:border-brand/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-4 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-4 [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {more && more.length > 0 && (
          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold mb-3">{t.common.sviClanci}</h2>
            <div className="flex flex-wrap gap-2">
              {more.map((m: any) => <Link key={m.slug} href={localeHref(`/blog/${m.slug}`, locale)} className="text-sm bg-brand/10 text-brand rounded-full px-3 py-1 hover:bg-brand hover:text-white">{m.title}</Link>)}
            </div>
          </section>
        )}
      </article>
      <Sidebar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BlogPosting",
        "headline": post.title, "description": post.excerpt || undefined,
        "datePublished": post.published_at, "dateModified": post.published_at,
        "inLanguage": locale, "url": localeUrl(`/blog/${post.slug}`, locale),
        "mainEntityOfPage": localeUrl(`/blog/${post.slug}`, locale),
        "author": { "@type": "Organization", "name": "Banja Vrujci" },
        "publisher": { "@type": "Organization", "name": "Banja Vrujci", "@id": `${SITE_URL}/#organization` }
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: t.nav.pocetna, item: localeUrl("/", locale) },
          { "@type": "ListItem", position: 2, name: t.nav.blog, item: localeUrl("/blog", locale) },
          { "@type": "ListItem", position: 3, name: post.title, item: localeUrl(`/blog/${post.slug}`, locale) }
        ]
      }) }} />
    </div>
  );
}
