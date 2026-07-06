export default function Stars({ value, count, size = "text-base" }: { value: number; count?: number; size?: string }) {
  const full = Math.round(value || 0);
  return (
    <span className={"inline-flex items-center gap-1 " + size}>
      <span className="text-amber-400">{"★".repeat(full)}<span className="text-slate-300">{"★".repeat(5 - full)}</span></span>
      {count != null && count > 0 && <span className="text-slate-500 text-sm">{value.toFixed(1)} ({count})</span>}
    </span>
  );
}
