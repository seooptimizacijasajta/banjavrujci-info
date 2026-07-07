import { getDict } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export const metadata = { title: "FAQ" };
export default function Page() {
  const t = getDict();
  return (
    <div className="py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-3">FAQ</h1>
      <p className="text-slate-600">{t.common.sadrzajUPripremi}</p>
    </div>
  );
}
