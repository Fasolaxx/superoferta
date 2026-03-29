export function DiscountBadge({ pct }: { pct: number }) {
  return (
    <span className="inline-flex items-center bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
      -{Math.round(pct)}%
    </span>
  );
}