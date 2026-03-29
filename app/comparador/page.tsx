import { db } from "@/lib/db";
import { formatPrice, supermarketColor, supermarketDot } from "@/lib/utils";

export const revalidate = 3600;

export default async function ComparadorPage() {
  const supermarkets = await db.supermarket.findMany();
  const categories = await db.category.findMany();

  // Agrupar ofertas por categoría y mostrar el precio más bajo por super
  const offersByCategory = await Promise.all(
    categories.map(async (cat) => {
      const offers = await db.offer.findMany({
        where: { isActive: true, categoryId: cat.id },
        include: { supermarket: true },
        orderBy: { currentPrice: "asc" },
      });
      return { category: cat, offers };
    })
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comparador de precios</h1>
        <p className="text-gray-500 text-sm mt-1">
          Compará productos entre Coto, Jumbo y Carrefour
        </p>
      </div>

      {/* Leyenda supermercados */}
      <div className="flex gap-4 flex-wrap">
        {supermarkets.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 text-sm text-gray-600">
            <span className={`w-2.5 h-2.5 rounded-full ${supermarketDot(s.slug)}`} />
            {s.name}
          </div>
        ))}
      </div>

      {/* Tabla por categoría */}
      {offersByCategory.map(({ category, offers }) =>
        offers.length === 0 ? null : (
          <div key={category.id}>
            <h2 className="text-base font-semibold text-gray-700 mb-3">
              {category.name}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Producto</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Supermercado</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Precio</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Descuento</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer, idx) => (
                    <tr
                      key={offer.id}
                      className={`border-b border-gray-50 last:border-0 ${
                        idx === 0 ? "bg-emerald-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-800">
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full shrink-0">
                              Mejor precio
                            </span>
                          )}
                          {offer.title}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${supermarketColor(offer.supermarket.slug)}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${supermarketDot(offer.supermarket.slug)}`} />
                          {offer.supermarket.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {formatPrice(Number(offer.currentPrice))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {offer.discountPercentage ? (
                          <span className="text-emerald-600 font-semibold">
                            -{Math.round(offer.discountPercentage)}%
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}