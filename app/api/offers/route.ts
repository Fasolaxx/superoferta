import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const supermarket = searchParams.get("supermarket");
  const category = searchParams.get("category");
  const search = searchParams.get("q");
  const sort = searchParams.get("sort") ?? "discount";
  const limit = Number(searchParams.get("limit") ?? "24");
  const page = Number(searchParams.get("page") ?? "1");

  const where = {
    isActive: true,
    ...(supermarket && { supermarket: { slug: supermarket } }),
    ...(category && { category: { slug: category } }),
    ...(search && { title: { contains: search, mode: "insensitive" as const } }),
  };

  const orderBy =
    sort === "discount"
      ? { discountPercentage: "desc" as const }
      : sort === "price"
      ? { currentPrice: "asc" as const }
      : { scrapedAt: "desc" as const };

  const [offers, total] = await Promise.all([
    db.offer.findMany({
      where,
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
      include: { supermarket: true, category: true },
    }),
    db.offer.count({ where }),
  ]);

  return NextResponse.json({ offers, total, page, limit });
}