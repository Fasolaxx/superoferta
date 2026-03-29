import { db } from "@/lib/db";
import { OffersClient } from "@/components/ui/OffersClient";

export const revalidate = 3600;

export default async function OfertasPage() {
  const [offers, supermarkets, categories] = await Promise.all([
    db.offer.findMany({
      where: { isActive: true },
      orderBy: { discountPercentage: "desc" },
      include: { supermarket: true, category: true },
    }),
    db.supermarket.findMany(),
    db.category.findMany(),
  ]);

  const serialized = offers.map((o) => ({
    ...o,
    currentPrice: Number(o.currentPrice),
    previousPrice: o.previousPrice ? Number(o.previousPrice) : null,
    startDate: o.startDate?.toISOString() ?? null,
    endDate: o.endDate?.toISOString() ?? null,
    scrapedAt: o.scrapedAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Todas las ofertas</h1>
        <p className="text-gray-500 text-sm mt-1">
          Actualizadas hoy · {offers.length} productos
        </p>
      </div>
      <OffersClient
        offers={serialized}
        supermarkets={supermarkets}
        categories={categories}
      />
    </div>
  );
}