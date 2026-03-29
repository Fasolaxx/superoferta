import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const recipe = await db.recipe.findUnique({
    where: { id: Number(params.id) },
    include: {
      ingredients: {
        include: {
          ingredient: {
            include: {
              productMatches: {
                where: { offer: { isActive: true } },
                include: { offer: { include: { supermarket: true } } },
                orderBy: { offer: { discountPercentage: "desc" } },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(recipe);
}