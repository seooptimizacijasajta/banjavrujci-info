import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { localeUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const CATS = ["apartmani", "vile", "privatni-smestaj", "sobe", "bungalovi", "vikendice", "konaci", "hoteli", "odmor-na-selu"];
const STATIC = ["/", "/smestaj", "/nekretnine", "/galerija", "/video", "/blog", "/manifestacije", "/info", "/kontakt", "/banja-vrujci"];

function entry(basePath: string, lastModified?: string | null): MetadataRoute.Sitemap[number] {
  return {
    url: localeUrl(basePath, "sr"),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency: "weekly",
    alternates: { languages: { "sr-RS": localeUrl(basePath, "sr"), en: localeUrl(basePath, "en"), de: localeUrl(basePath, "de") } }
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const [{ data: pages }, { data: listings }, { data: posts }] = await Promise.all([
    supabase.from("pages").select("slug,updated_at").eq("status", "published"),
    supabase.from("listings").select("slug,updated_at").eq("status", "approved"),
    supabase.from("posts").select("slug,published_at").eq("status", "published")
  ]);

  const seen = new Set<string>();
  const items: MetadataRoute.Sitemap = [];
  const add = (basePath: string, lm?: string | null) => {
    if (seen.has(basePath)) return;
    seen.add(basePath);
    items.push(entry(basePath, lm));
  };

  STATIC.forEach((p) => add(p));
  CATS.forEach((c) => add(`/smestaj/${c}`));
  (pages || []).forEach((p: any) => add(`/${p.slug}`, p.updated_at));
  (listings || []).forEach((l: any) => add(`/smestaj/${l.slug}`, l.updated_at));
  (posts || []).forEach((p: any) => add(`/blog/${p.slug}`, p.published_at));

  return items;
}
