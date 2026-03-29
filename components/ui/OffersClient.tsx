"use client";

import { useState, useMemo } from "react";
import { Offer } from "@/lib/types";
import { OfferCard } from "./OfferCard";
import { supermarketDot } from "@/lib/utils";

interface Props {
  offers: Offer[];
  supermarkets: { id: number; name: string; slug: string }[];
  categories: { id: number; name: string; slug: string }[];
}

export function OffersClient({ offers, supermarkets, categories }: Props) {
  const [supermarketFilter, setSupermarketFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<"discount" | "price" | "recent">("discount");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...offers];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.title.toLowerCase().includes(q));
    }

    if (supermarketFilter) {
      result = result.filter((o) => o.supermarket.slug === supermarketFilter);
    }

    if (categoryFilter) {
      result = result.filter((o) => o.category?.slug === categoryFilter);
    }

    if (sort === "discount") {
      result.sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0));
    } else if (sort === "price") {
      result.sort((a, b) => a.currentPrice - b.currentPrice);
    }

    return result;
  }, [offers, search, supermarketFilter, categoryFilter, sort]);

  function toggleSuper(slug: string) {
    setSupermarketFilter((prev) => (prev === slug ? null : slug));
  }

  function toggleCat(slug: string) {
    setCategoryFilter((prev) => (prev === slug ? null : slug));
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Buscador */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros supermercado */}
      <div className="flex flex-wrap gap-2">
        {supermarkets.map((s) => (
          <button
            key={s.id}
            onClick={() => toggleSuper(s.slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              supermarketFilter === s.slug
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${supermarketDot(s.slug)}`} />
            {s.name}
          </button>
        ))}

        <div className="w-px bg-gray-200 mx-1" />

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => toggleCat(c.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              categoryFilter === c.slug
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Ordenar + contador */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filtered.length === offers.length
            ? `${offers.length} ofertas`
            : `${filtered.length} de ${offers.length} ofertas`}
          {supermarketFilter || categoryFilter || search ? (
            <button
              onClick={() => {
                setSupermarketFilter(null);
                setCategoryFilter(null);
                setSearch("");
              }}
              className="ml-2 text-emerald-600 hover:underline"
            >
              Limpiar filtros
            </button>
          ) : null}
        </p>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-emerald-400"
        >
          <option value="discount">Mayor descuento</option>
          <option value="price">Menor precio</option>
          <option value="recent">Más recientes</option>
        </select>
      </div>

      {/* Grid de ofertas */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No encontramos ofertas con ese filtro</p>
          <button
            onClick={() => {
              setSupermarketFilter(null);
              setCategoryFilter(null);
              setSearch("");
            }}
            className="mt-3 text-sm text-emerald-600 hover:underline"
          >
            Ver todas las ofertas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}