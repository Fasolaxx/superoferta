export interface Supermarket {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Offer {
  id: number;
  title: string;
  currentPrice: number;
  previousPrice?: number | null;
  discountPercentage?: number | null;
  promoType?: string | null;
  imageUrl?: string | null;
  productUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  scrapedAt?: string | null;
  isActive: boolean;
  supermarket: Supermarket;
  category?: Category | null;
}

export interface RecipeIngredient {
  ingredient: { id: number; name: string };
  quantity?: string | null;
  unit?: string | null;
  onSale?: boolean;
  offer?: Offer | null;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  prepMinutes?: number | null;
  servings?: number | null;
  ingredients: RecipeIngredient[];
  offersOnSale?: number;
}