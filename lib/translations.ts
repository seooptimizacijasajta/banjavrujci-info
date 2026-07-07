import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/locale-path";

type EntityType = "listing" | "page";
const FIELDS = ["title", "excerpt", "description", "content", "meta_title", "meta_description"] as const;

async function fetchMap(entityType: EntityType, ids: number[], locale: Locale) {
  const map: Record<number, any> = {};
  if (locale === "sr" || ids.length === 0) return map;
  const supabase = createClient();
  const { data } = await supabase
    .from("content_translations")
    .select("entity_id,title,excerpt,description,content,meta_title,meta_description")
    .eq("entity_type", entityType)
    .eq("locale", locale)
    .in("entity_id", ids);
  (data || []).forEach((t: any) => { map[t.entity_id] = t; });
  return map;
}

function apply<T extends { id: number }>(row: T, tr: any | undefined): T {
  if (!tr) return row;
  const out: any = { ...row };
  for (const k of FIELDS) {
    if (tr[k] != null && tr[k] !== "") out[k] = tr[k];
  }
  return out;
}

/** Merge translations into a list of rows. Missing fields fall back to Serbian. */
export async function localizeRows<T extends { id: number }>(entityType: EntityType, rows: T[] | null | undefined, locale: Locale): Promise<T[]> {
  const list = rows || [];
  if (locale === "sr" || list.length === 0) return list;
  const map = await fetchMap(entityType, list.map((r) => r.id), locale);
  return list.map((r) => apply(r, map[r.id]));
}

/** Merge a translation into a single row. Missing fields fall back to Serbian. */
export async function localizeRow<T extends { id: number }>(entityType: EntityType, row: T | null | undefined, locale: Locale): Promise<T | null | undefined> {
  if (locale === "sr" || !row) return row;
  const map = await fetchMap(entityType, [row.id], locale);
  return apply(row, map[row.id]);
}
