import { signUp } from "../actions/auth";
import { passwordRuleText } from "@/lib/password";
import OAuthButtons from "@/components/OAuthButtons";
export const metadata = { title: "Registracija" };
export default function Register({ searchParams }: { searchParams: { err?: string } }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-4">Registracija</h1>
      {searchParams.err && <p className="mb-3 text-red-600 text-sm">{searchParams.err}</p>}
      <form action={signUp} className="space-y-3">
        <input name="full_name" required placeholder="Ime i prezime" className="w-full border rounded px-3 py-2" />
        <input name="email" type="email" required placeholder="E-mail" className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" required placeholder="Lozinka" className="w-full border rounded px-3 py-2" />
        <p className="text-xs text-slate-500">{passwordRuleText}</p>
        <button className="w-full bg-brand text-white rounded py-2 font-semibold">Napravi nalog</button>
      </form>
      <OAuthButtons />
      <p className="text-sm mt-4">Imaš nalog? <a href="/login" className="text-brand underline">Prijavi se</a></p>
    </div>
  );
}
