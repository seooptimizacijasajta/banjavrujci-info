# Banja Vrujci — Portal (Next.js + Supabase)

Prototip Faze 1: nalozi/uloge, modul Smeštaj (dodavanje → odobravanje), javne stranice.

## Pokretanje lokalno
```bash
npm install
npm run dev
```
Otvori http://localhost:3000

`.env.local` je već popunjen (Supabase URL + publishable key za projekat `banjavrujci-info`).

## Šta radi
- **Registracija / prijava** (email + lozinka). Jaka lozinka je obavezna (malo+Veliko slovo, broj, znak, min 8).
- **Potvrda e-maila**: Supabase podrazumevano traži potvrdu mejla pre prijave.
- **Superadmin**: naloga `banjavrujci@gmail.com` i `margaretagrujic@gmail.com` automatski dobijaju superadmin ulogu pri registraciji.
- **Moj panel** (`/nalog`): vlasnik vidi samo svoje objekte i dodaje nove.
- **Dodavanje smeštaja** (`/nalog/smestaj/novi`): naslov, kategorija, opis (min 700 reči — brojač), cena, telefon, adresa, marker na mapi (klik/prevuci), slike (URL-ovi), do 3 YouTube videa. Objekat ide u status „na čekanju".
- **Admin** (`/admin`): superadmin/admin vidi objekte na čekanju i Odobri/Odbij.
- **Javno**: početna sa hero + Preporučeni/Izdvojeni/Sav smeštaj; `/smestaj` lista; `/smestaj/[slug]` detalj sa galerijom, mapom i videom.
- Baza je zaštićena preko Supabase RLS: vlasnik fizički ne može da vidi/menja tuđe objekte; javno se vide samo odobreni.

## Sledeći koraci (van koda)
1. **Google/Facebook prijava**: uključiti u Supabase → Authentication → Providers (treba OAuth ključevi — vodim te kroz to).
2. **Potvrda e-maila / SMTP**: podesiti pošiljaoca u Supabase → Authentication.
3. **Upload slika**: trenutno se unose URL-ovi; sledeće je Supabase Storage sa proverom fajla.
4. **Deploy**: Vercel (povezati repo + iste env promenljive).
