import Link from "next/link";
import { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const onSale = recipe.offersOnSale ?? 0;
  const total = recipe.ingredients.length;

  return (
    <Link href={`/recetas/${recipe.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 leading-snug">{recipe.name}</h3>
          {onSale > 0 && (
            <span className="shrink-0 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {onSale}/{total} en oferta
            </span>
          )}
        </div>

        {recipe.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
          {recipe.prepMinutes && <span>⏱ {recipe.prepMinutes} min</span>}
          {recipe.servings && <span>👥 {recipe.servings} porciones</span>}
        </div>
      </div>
    </Link>
  );
}