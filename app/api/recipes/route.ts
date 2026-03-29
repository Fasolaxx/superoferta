import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const recipes = await db.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: {
            include: {
              productMatches: {
                where: { offer: { isActive: true } },
                include: { offer: { include: { supermarket: true } } },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const enriched = recipes.map((recipe) => {
    const offersOnSale = recipe.ingredients.filter(
      (ri) => ri.ingredient.productMatches.length > 0
    ).length;
    return { ...recipe, offersOnSale };
  });

  enriched.sort((a, b) => b.offersOnSale - a.offersOnSale);
  return NextResponse.json(enriched);
}