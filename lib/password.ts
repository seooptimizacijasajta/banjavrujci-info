// Jaka lozinka: min 8, malo + Veliko slovo, broj i specijalan znak
export function passwordProblems(pw: string): string[] {
  const p: string[] = [];
  if (pw.length < 8) p.push("najmanje 8 karaktera");
  if (!/[a-z]/.test(pw)) p.push("jedno malo slovo");
  if (!/[A-Z]/.test(pw)) p.push("jedno veliko slovo");
  if (!/[0-9]/.test(pw)) p.push("jedan broj");
  if (!/[^A-Za-z0-9]/.test(pw)) p.push("jedan specijalan znak");
  return p;
}
export const passwordRuleText =
  "Lozinka mora imati najmanje 8 karaktera, malo i veliko slovo, broj i specijalan znak.";
