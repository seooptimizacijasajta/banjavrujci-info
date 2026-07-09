import { updatePassword } from "../../actions/auth";
import { passwordRuleText } from "@/lib/password";
export const dynamic = "force-dynamic";
export const metadata = { title: "Nova lozinka" };
export default function ResetPassword({ searchParams }: { searchParams: { err?: string } }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-2">Postavite novu lozinku</h1>
      <p className="text-sm text-slate-600 mb-4">Unesite novu lozinku za vaš nalog.</p>
      {searchParams.err && <p className="mb-3 text-red-600 text-sm">{searchParams.err}</p>}
      <form action={updatePassword} className="space-y-3">
        <input name="password" type="password" required placeholder="Nova lozinka" className="w-full border rounded px-3 py-2" />
        <p className="text-xs text-slate-500">{passwordRuleText}</p>
        <button className="w-full bg-brand text-white rounded py-2 font-semibold">Sačuvaj lozinku</button>
      </form>
    </div>
  );
}
