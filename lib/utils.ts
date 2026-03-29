export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function supermarketColor(slug: string): string {
  const colors: Record<string, string> = {
    coto: "bg-red-100 text-red-800",
    jumbo: "bg-green-100 text-green-800",
    carrefour: "bg-blue-100 text-blue-800",
  };
  return colors[slug] ?? "bg-gray-100 text-gray-800";
}

export function supermarketDot(slug: string): string {
  const colors: Record<string, string> = {
    coto: "bg-red-500",
    jumbo: "bg-green-500",
    carrefour: "bg-blue-500",
  };
  return colors[slug] ?? "bg-gray-400";
}