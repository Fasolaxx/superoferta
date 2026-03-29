import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a: string, b: string): number {
  const setA = new Set(normalize(a).split(" ").filter((w) => w.length > 2));
  const setB = new Set(normalize(b).split(" ").filter((w) => w.length > 2));
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = [...setA].filter((w) => setB.has(w)).length;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

const ALIASES: Record<string, string[]> = {
  tomate: ["tomate redondo", "tomate perita", "tomate cherry"],
  pollo: ["pollo entero", "pechuga de pollo", "muslo de pollo", "pollo trozado"],
  "carne picada": ["carne picada comun", "carne picada especial", "carne molida"],
  papa: ["papa blanca", "papa negra", "papas"],
  cebolla: ["cebolla blanca", "cebolla morada", "cebolla de verdeo"],
  leche: ["leche entera", "leche descremada", "leche serenisima"],
  arroz: ["arroz largo fino", "arroz parboil", "arroz integral", "molinos ala"],
  fideos: ["fideos spaghetti", "fideos tallarines", "fideos mostacholes", "matarazzo"],
  ajo: ["ajo entero", "ajo pelado"],
};

async function main() {
  console.log("🔍 Iniciando match de ofertas con ingredientes...");

  const offers = await db.offer.findMany({
    where: { isActive: true },
    select: { id: true, title: true },
  });

  const ingredients = await db.ingredient.findMany({
    select: { id: true, name: true, normalizedName: true },
  });

  // Limpiar matches del día anterior
  await db.productMatch.deleteMany({});
  console.log(`📦 ${offers.length} ofertas | 🥕 ${ingredients.length} ingredientes`);

  const matches: { offerId: number; ingredientId: number; confidence: number }[] = [];

  for (const offer of offers) {
    const normalizedTitle = normalize(offer.title);

    for (const ingredient of ingredients) {
      let confidence = 0;

      // 1. Match directo por nombre normalizado
      if (normalizedTitle.includes(ingredient.normalizedName)) {
        confidence = Math.max(confidence, 0.95);
      }

      // 2. Aliases explícitos
      const aliasList = ALIASES[ingredient.normalizedName] ?? [];
      for (const alias of aliasList) {
        if (normalizedTitle.includes(normalize(alias))) {
          confidence = Math.max(confidence, 0.9);
        }
      }

      // 3. Similitud Jaccard como fallback
      if (confidence < 0.5) {
        const jac = similarity(offer.title, ingredient.name);
        confidence = Math.max(confidence, jac);
      }

      if (confidence >= 0.5) {
        matches.push({
          offerId: offer.id,
          ingredientId: ingredient.id,
          confidence,
        });
      }
    }
  }

  if (matches.length > 0) {
    await db.productMatch.createMany({ data: matches, skipDuplicates: true });
  }

  console.log(`✅ ${matches.length} matches creados`);

  // Mostrar resumen
  for (const m of matches) {
    const offer = offers.find((o) => o.id === m.offerId);
    const ingredient = ingredients.find((i) => i.id === m.ingredientId);
    console.log(`  ${ingredient?.name} ← "${offer?.title}" (${(m.confidence * 100).toFixed(0)}%)`);
  }
}

main().catch(console.error).finally(() => db.$disconnect());