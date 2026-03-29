import { db } from "@/lib/db";
import { OfferCard } from "@/components/ui/OfferCard";
import { RecipeCard } from "@/components/ui/RecipeCard";
import Link from "next/link";

export const revalidate = 3600;

async function getBestOffers() {
  const offers = await db.offer.findMany({
    where: { isActive: true },
    orderBy: { discountPercentage: "desc" },
    take: 6,
    include: { supermarket: true, category: true },
  });
  return offers.map((o) => ({
    ...o,
    currentPrice: Number(o.currentPrice),
    previousPrice: o.previousPrice ? Number(o.previousPrice) : null,
    startDate: o.startDate?.toISOString() ?? null,
    endDate: o.endDate?.toISOString() ?? null,
    scrapedAt: o.scrapedAt.toISOString(),
  }));
}

async function getRecipes() {
  const recipes = await db.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: {
            include: {
              productMatches: {
                where: { offer: { isActive: true } },
                take: 1,
              },
            },
          },
        },
      },
    },
    take: 4,
  });
  return recipes.map((r) => ({
    ...r,
    offersOnSale: r.ingredients.filter(
      (i) => i.ingredient.productMatches.length > 0
    ).length,
  }));
}

async function getStats() {
  const [totalOffers, totalRecipes, bestDiscount] = await Promise.all([
    db.offer.count({ where: { isActive: true } }),
    db.recipe.count(),
    db.offer.findFirst({
      where: { isActive: true },
      orderBy: { discountPercentage: "desc" },
      select: { discountPercentage: true },
    }),
  ]);
  return { totalOffers, totalRecipes, bestDiscount: bestDiscount?.discountPercentage ?? 0 };
}

export default async function Home() {
  const [offers, recipes, stats] = await Promise.all([
    getBestOffers(),
    getRecipes(),
    getStats(),
  ]);

  return (
    <div className="flex flex-col gap-12">

      {/* Hero */}
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Ahorrá en el súper 🛒
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
          Las mejores ofertas de Coto, Jumbo y Carrefour.<br />
          Recetas con lo que está en oferta hoy.
        </p>

        {/* Buscador rápido */}
        <Link href="/ofertas">
          <div className="max-w-md mx-auto flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer">
            <span className="text-gray-400">🔍</span>
            <span className="text-gray-400 text-sm">Buscá un producto...</span>
          </div>
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.totalOffers}</p>
          <p className="text-sm text-gray-500 mt-1">ofertas activas</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">
            -{Math.round(stats.bestDiscount)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">mejor descuento</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.totalRecipes}</p>
          <p className="text-sm text-gray-500 mt-1">recetas económicas</p>
        </div>
      </section>

      {/* Accesos rápidos */}
      <section className="grid grid-cols-3 gap-3">
        <Link href="/ofertas?sort=discount">
          <div className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl p-4 transition-colors cursor-pointer">
            <p className="text-2xl mb-2">🏷️</p>
            <p className="font-semibold text-emerald-800 text-sm">Mayores descuentos</p>
            <p className="text-xs text-emerald-600 mt-0.5">Ver ofertas →</p>
          </div>
        </Link>
        <Link href="/recetas">
          <div className="bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-2xl p-4 transition-colors cursor-pointer">
            <p className="text-2xl mb-2">🍳</p>
            <p className="font-semibold text-orange-800 text-sm">Recetas del día</p>
            <p className="text-xs text-orange-600 mt-0.5">Con lo que está en oferta →</p>
          </div>
        </Link>
        <Link href="/comparador">
          <div className="bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl p-4 transition-colors cursor-pointer">
            <p className="text-2xl mb-2">⚖️</p>
            <p className="font-semibold text-blue-800 text-sm">Comparar precios</p>
            <p className="text-xs text-blue-600 mt-0.5">Coto vs Jumbo vs Carrefour →</p>
          </div>
        </Link>
      </section>

      {/* Mejores ofertas */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Mejores ofertas del día
          </h2>
          <Link href="/ofertas" className="text-sm text-emerald-600 hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </section>

      {/* Recetas */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recetas con lo que está en oferta
          </h2>
          <Link href="/recetas" className="text-sm text-emerald-600 hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

    </div>
  );
}