import { db } from "@/lib/db";
import { formatPrice, supermarketColor } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RecetaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await db.recipe.findUnique({
    where: { id: Number(id) },  
    include: {
      ingredients: {
        include: {
          ingredient: {
            include: {
              productMatches: {
                where: { offer: { isActive: true } },
                include: { offer: { include: { supermarket: true } } },
                orderBy: { confidence: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!recipe) notFound();

  const onSale = recipe.ingredients.filter(
    (i) => i.ingredient.productMatches.length > 0
  ).length;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <Link href="/recetas" className="text-sm text-emerald-600 hover:underline mb-3 inline-block">
          ← Volver a recetas
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{recipe.name}</h1>
        {recipe.description && (
          <p className="text-gray-500 mt-2">{recipe.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
          {recipe.prepMinutes && <span>⏱ {recipe.prepMinutes} min</span>}
          {recipe.servings && <span>👥 {recipe.servings} porciones</span>}
          {onSale > 0 && (
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
              {onSale}/{recipe.ingredients.length} ingredientes en oferta
            </span>
          )}
        </div>
      </div>

      {/* Ingredientes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Ingredientes</h2>
        <div className="flex flex-col gap-2">
          {recipe.ingredients.map((ri) => {
            const match = ri.ingredient.productMatches[0];
            const offer = match?.offer;
            return (
              <div
                key={ri.ingredient.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  offer
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {offer && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium text-gray-800">
                    {ri.ingredient.name}
                  </span>
                  {ri.quantity && (
                    <span className="text-xs text-gray-400">
                      {ri.quantity} {ri.unit}
                    </span>
                  )}
                </div>
                {offer && (
                  <div className="flex items-center gap-2 text-right">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${supermarketColor(
                        offer.supermarket.slug
                      )}`}
                    >
                      {offer.supermarket.name}
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                      {formatPrice(Number(offer.currentPrice))}
                    </span>
                    {offer.discountPercentage && (
                      <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                        -{Math.round(offer.discountPercentage)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pasos (próxima versión) */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Preparación</h2>
        <p className="text-sm text-gray-500">
          Los pasos detallados estarán disponibles próximamente. Por ahora podés buscar esta receta en Google con los ingredientes en oferta que ya tenés identificados arriba.
        </p>
      </div>
    </div>
  );
}