import { requestPasswordReset } from "../actions/auth";
export const metadata = { title: "Zaboravljena lozinka" };
export default function Forgot({ searchParams }: { searchParams: { err?: string; msg?: string } }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-2">Zaboravljena lozinka</h1>
      <p className="text-sm text-slate-600 mb-4">Unesite e-mail adresu naloga i poslaćemo vam link za postavljanje nove lozinke.</p>
      {searchParams.msg && <p className="mb-3 text-green-700 text-sm">{searchParams.msg}</p>}
      {searchParams.err && <p className="mb-3 text-red-600 text-sm">{searchParams.err}</p>}
      <form action={requestPasswordReset} className="space-y-3">
        <input name="email" type="email" required placeholder="E-mail" className="w-full border rounded px-3 py-2" />
        <button className="w-full bg-brand text-white rounded py-2 font-semibold">Pošalji link</button>
      </form>
      <p className="text-sm mt-4"><a href="/login" className="text-brand underline">Nazad na prijavu</a></p>
    </div>
  );
}
