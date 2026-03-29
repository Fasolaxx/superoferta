import { db } from "@/lib/db";
import { RecipeCard } from "@/components/ui/RecipeCard";

export const revalidate = 3600;

export default async function RecetasPage() {
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
  });

  const enriched = recipes
    .map((r) => ({
      ...r,
      offersOnSale: r.ingredients.filter((i) => i.ingredient.productMatches.length > 0).length,
    }))
    .sort((a, b) => b.offersOnSale - a.offersOnSale);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recetas económicas</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ordenadas por cantidad de ingredientes en oferta hoy
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enriched.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}