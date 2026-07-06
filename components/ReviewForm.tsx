"use client";
import { useState } from "react";
import { submitReview } from "@/app/actions/reviews";

export default function ReviewForm({ listingId, slug }: { listingId: number; slug: string }) {
  const [rating, setRating] = useState(5);
  return (
    <form action={submitReview} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map((n) => (
          <button type="button" key={n} onClick={() => setRating(n)} className={"text-2xl " + (n <= rating ? "text-amber-400" : "text-slate-300")} aria-label={`${n} zvezdica`}>★</button>
        ))}
        <span className="text-sm text-slate-500 ml-2">{rating}/5</span>
      </div>
      <textarea name="comment" rows={3} placeholder="Vaš utisak (opciono)" className="w-full border rounded px-3 py-2 text-sm" />
      <button className="bg-brand text-white rounded px-4 py-2 font-semibold text-sm">Ostavi ocenu</button>
      <p className="text-xs text-slate-500">Ocena se objavljuje nakon što je administrator odobri.</p>
    </form>
  );
}
