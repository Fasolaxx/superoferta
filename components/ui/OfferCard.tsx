import { Offer } from "@/lib/types";
import { formatPrice, supermarketColor, supermarketDot } from "@/lib/utils";
import { DiscountBadge } from "./DiscountBadge";

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Supermercado */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${supermarketColor(offer.supermarket.slug)}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${supermarketDot(offer.supermarket.slug)}`} />
          {offer.supermarket.name}
        </span>
        {offer.discountPercentage && (
          <DiscountBadge pct={offer.discountPercentage} />
        )}
      </div>

      {/* Título */}
      <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
        {offer.title}
      </p>

      {/* Precios */}
      <div className="flex items-end gap-2 mt-auto">
        <span className="text-xl font-bold text-gray-900">
          {formatPrice(offer.currentPrice)}
        </span>
        {offer.previousPrice && (
          <span className="text-sm text-gray-400 line-through mb-0.5">
            {formatPrice(offer.previousPrice)}
          </span>
        )}
      </div>

      {/* Categoría */}
      {offer.category && (
        <span className="text-xs text-gray-400">{offer.category.name}</span>
      )}
    </div>
  );
}