import { createListing } from "@/app/actions/listings";
import ListingForm from "@/components/ListingForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export const metadata = { title: "Dodaj smeštaj" };
export default async function Novi({ searchParams }: { searchParams: { err?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dodaj smeštaj</h1>
      <ListingForm action={createListing} err={searchParams.err} />
    </div>
  );
}
