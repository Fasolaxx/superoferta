import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const [coto, jumbo, carrefour] = await Promise.all([
    db.supermarket.upsert({ where: { slug: "coto" }, create: { name: "Coto", slug: "coto" }, update: {} }),
    db.supermarket.upsert({ where: { slug: "jumbo" }, create: { name: "Jumbo", slug: "jumbo" }, update: {} }),
    db.supermarket.upsert({ where: { slug: "carrefour" }, create: { name: "Carrefour", slug: "carrefour" }, update: {} }),
  ]);

  const [carnes, verduras, lacteos, almacen] = await Promise.all([
    db.category.upsert({ where: { slug: "carnes" }, create: { name: "Carnes", slug: "carnes" }, update: {} }),
    db.category.upsert({ where: { slug: "verduras" }, create: { name: "Verduras", slug: "verduras" }, update: {} }),
    db.category.upsert({ where: { slug: "lacteos" }, create: { name: "Lácteos", slug: "lacteos" }, update: {} }),
    db.category.upsert({ where: { slug: "almacen" }, create: { name: "Almacén", slug: "almacen" }, update: {} }),
  ]);

  await db.offer.createMany({
    skipDuplicates: true,
    data: [
      { supermarketId: coto.id, categoryId: carnes.id, title: "Pechuga de Pollo sin hueso x kg", currentPrice: 2490, previousPrice: 3500, discountPercentage: 29, promoType: "Precio especial", isActive: true },
      { supermarketId: coto.id, categoryId: verduras.id, title: "Tomate Redondo x kg", currentPrice: 890, previousPrice: 1200, discountPercentage: 26, promoType: "Oferta del día", isActive: true },
      { supermarketId: coto.id, categoryId: almacen.id, title: "Arroz largo fino Molinos Ala 1kg", currentPrice: 1100, previousPrice: 1500, discountPercentage: 27, promoType: "Precio especial", isActive: true },
      { supermarketId: jumbo.id, categoryId: carnes.id, title: "Carne Picada común x kg", currentPrice: 3100, previousPrice: 4200, discountPercentage: 26, promoType: "2x1", isActive: true },
      { supermarketId: jumbo.id, categoryId: lacteos.id, title: "Leche entera La Serenísima 1L", currentPrice: 850, previousPrice: 1100, discountPercentage: 23, promoType: "Precio especial", isActive: true },
      { supermarketId: jumbo.id, categoryId: verduras.id, title: "Cebolla blanca x kg", currentPrice: 550, previousPrice: 800, discountPercentage: 31, promoType: "Oferta semanal", isActive: true },
      { supermarketId: carrefour.id, categoryId: verduras.id, title: "Papa blanca x kg", currentPrice: 650, previousPrice: 900, discountPercentage: 28, promoType: "Oferta semanal", isActive: true },
      { supermarketId: carrefour.id, categoryId: carnes.id, title: "Pollo entero Granja del Sol x kg", currentPrice: 2100, previousPrice: 2800, discountPercentage: 25, promoType: "Precio especial", isActive: true },
      { supermarketId: carrefour.id, categoryId: almacen.id, title: "Fideos spaghetti Matarazzo 500g", currentPrice: 780, previousPrice: 1050, discountPercentage: 26, promoType: "Precio especial", isActive: true },
    ],
  });

  const [tomate, pollo, carnePicada, leche, papa, ajo, cebolla, arroz, fideos] = await Promise.all([
    db.ingredient.upsert({ where: { id: 1 }, create: { id: 1, name: "Tomate", normalizedName: "tomate", category: "verduras" }, update: {} }),
    db.ingredient.upsert({ where: { id: 2 }, create: { id: 2, name: "Pollo", normalizedName: "pollo", category: "carnes" }, update: {} }),
    db.ingredient.upsert({ where: { id: 3 }, create: { id: 3, name: "Carne picada", normalizedName: "carne picada", category: "carnes" }, update: {} }),
    db.ingredient.upsert({ where: { id: 4 }, create: { id: 4, name: "Leche", normalizedName: "leche", category: "lacteos" }, update: {} }),
    db.ingredient.upsert({ where: { id: 5 }, create: { id: 5, name: "Papa", normalizedName: "papa", category: "verduras" }, update: {} }),
    db.ingredient.upsert({ where: { id: 6 }, create: { id: 6, name: "Ajo", normalizedName: "ajo", category: "verduras" }, update: {} }),
    db.ingredient.upsert({ where: { id: 7 }, create: { id: 7, name: "Cebolla", normalizedName: "cebolla", category: "verduras" }, update: {} }),
    db.ingredient.upsert({ where: { id: 8 }, create: { id: 8, name: "Arroz", normalizedName: "arroz", category: "almacen" }, update: {} }),
    db.ingredient.upsert({ where: { id: 9 }, create: { id: 9, name: "Fideos", normalizedName: "fideos", category: "almacen" }, update: {} }),
  ]);

  const recipe1 = await db.recipe.create({
    data: { name: "Pollo al horno con papas", description: "Clásico económico, ideal cuando el pollo o las papas están en oferta.", prepMinutes: 60, servings: 4 },
  });
  await db.recipeIngredient.createMany({
    skipDuplicates: true,
    data: [
      { recipeId: recipe1.id, ingredientId: pollo.id, quantity: "1", unit: "kg" },
      { recipeId: recipe1.id, ingredientId: papa.id, quantity: "500", unit: "g" },
      { recipeId: recipe1.id, ingredientId: ajo.id, quantity: "3", unit: "dientes" },
      { recipeId: recipe1.id, ingredientId: cebolla.id, quantity: "1", unit: "unidad" },
    ],
  });

  const recipe2 = await db.recipe.create({
    data: { name: "Salsa de tomate casera", description: "Rendidora y económica. Ideal cuando el tomate está en oferta.", prepMinutes: 30, servings: 6 },
  });
  await db.recipeIngredient.createMany({
    skipDuplicates: true,
    data: [
      { recipeId: recipe2.id, ingredientId: tomate.id, quantity: "1", unit: "kg" },
      { recipeId: recipe2.id, ingredientId: ajo.id, quantity: "2", unit: "dientes" },
      { recipeId: recipe2.id, ingredientId: cebolla.id, quantity: "1", unit: "unidad" },
    ],
  });

  const recipe3 = await db.recipe.create({
    data: { name: "Arroz con leche", description: "Postre clásico y económico con pocos ingredientes.", prepMinutes: 40, servings: 6 },
  });
  await db.recipeIngredient.createMany({
    skipDuplicates: true,
    data: [
      { recipeId: recipe3.id, ingredientId: arroz.id, quantity: "200", unit: "g" },
      { recipeId: recipe3.id, ingredientId: leche.id, quantity: "1", unit: "L" },
    ],
  });

  const recipe4 = await db.recipe.create({
    data: { name: "Fideos con salsa", description: "Rápido y económico, perfecto para cualquier día.", prepMinutes: 20, servings: 4 },
  });
  await db.recipeIngredient.createMany({
    skipDuplicates: true,
    data: [
      { recipeId: recipe4.id, ingredientId: fideos.id, quantity: "500", unit: "g" },
      { recipeId: recipe4.id, ingredientId: tomate.id, quantity: "500", unit: "g" },
      { recipeId: recipe4.id, ingredientId: ajo.id, quantity: "2", unit: "dientes" },
      { recipeId: recipe4.id, ingredientId: cebolla.id, quantity: "1", unit: "unidad" },
    ],
  });

  console.log("✅ Seed completo");
}

main().catch(console.error).finally(() => db.$disconnect());