import { signIn } from "../actions/auth";
import OAuthButtons from "@/components/OAuthButtons";
export const metadata = { title: "Prijava" };
export default function Login({ searchParams }: { searchParams: { err?: string; msg?: string } }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-4">Prijava</h1>
      {searchParams.msg && <p className="mb-3 text-green-700 text-sm">{searchParams.msg}</p>}
      {searchParams.err && <p className="mb-3 text-red-600 text-sm">{searchParams.err}</p>}
      <form action={signIn} className="space-y-3">
        <input name="email" type="email" required placeholder="E-mail" className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" required placeholder="Lozinka" className="w-full border rounded px-3 py-2" />
        <button className="w-full bg-brand text-white rounded py-2 font-semibold">Prijavi se</button>
      </form>
      <OAuthButtons />
      <p className="text-sm mt-4">Nemaš nalog? <a href="/register" className="text-brand underline">Registruj se</a></p>
    </div>
  );
}
