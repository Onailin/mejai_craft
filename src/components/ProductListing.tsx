"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, X } from "lucide-react";
import { SITE_LINE_URL } from "@/lib/brand";

export type ListingProduct = {
  id: string;
  name: string;
  subLabel: string;
  description?: string;
  category: string;
  imageUrl?: string;
  price?: number;
  originalPrice?: number;
  isNew?: boolean;
  salePercent?: number;
};

export type ListingCategory = {
  id: string;
  label: string;
};

const PAGE_SIZE = 12;

function formatPrice(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

type ProductListingProps = {
  products: ListingProduct[];
  categories: ListingCategory[];
  onProductClick?: (id: string) => void;
};

export default function ProductListing({ products, categories }: ProductListingProps) {
  const navCategories = useMemo(() => {
    if (categories.some((category) => category.id === "all")) {
      return categories;
    }
    return [{ id: "all", label: "ทั้งหมด" }, ...categories];
  }, [categories]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  const categoryLabelById = useMemo(
    () => new Map(navCategories.map((category) => [category.id, category.label])),
    [navCategories]
  );

  useEffect(() => {
    if (!navCategories.some((category) => category.id === activeCategory)) {
      setActiveCategory("all");
    }
  }, [navCategories, activeCategory]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const categoryLabel = categoryLabelById.get(product.category) ?? "";
      const haystack = [product.name, product.subLabel, product.description ?? "", categoryLabel]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [products, activeCategory, searchQuery, categoryLabelById]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const paginatedProducts = filteredProducts.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE
  );

  const activeCategoryLabel =
    navCategories.find((category) => category.id === activeCategory)?.label ?? "สินค้า";

  function handleCategoryChange(categoryId: string) {
    setActiveCategory(categoryId);
    setPage(0);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setPage(0);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 text-stone-900 sm:px-8 lg:px-10">
      <header className="border-b border-stone-200 pb-8">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-400">
            Mejai Crafts
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-luxury-ink sm:text-4xl">
            รายการสินค้า
          </h1>
          <div className="mx-auto mt-5 flex max-w-[220px] items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-stone-300" />
            <span className="text-[10px] text-stone-300" aria-hidden>
              ✦
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-stone-300 to-stone-300" />
          </div>
          <p className="mt-4 text-sm text-stone-500">
            {activeCategoryLabel}
            <span className="mx-2 text-stone-300">·</span>
            {filteredProducts.length} รายการ
          </p>
        </div>

        <nav
          className="mt-10 flex justify-center gap-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="หมวดสินค้า"
        >
          {navCategories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={`shrink-0 border-b pb-2 text-sm transition ${
                  isActive
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-700"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </nav>

        <label className="relative mx-auto mt-8 block max-w-md">
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-300" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="w-full border-b border-stone-200 bg-transparent py-2.5 pl-8 pr-8 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
              aria-label="ล้างการค้นหา"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>
      </header>

      {paginatedProducts.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-10">
          {paginatedProducts.map((product) => (
            <article key={product.id} className="group">
              <Link
                href={`/product/${product.id}`}
                className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-stone-50 p-3 no-underline"
              >
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <span className="text-xs text-stone-400">ไม่มีรูป</span>
                )}
              </Link>

              <div className="space-y-1.5 pt-4">
                <Link href={`/product/${product.id}`} className="block no-underline">
                  <h2 className="line-clamp-2 text-sm font-semibold text-stone-900 group-hover:text-stone-700">
                    {product.name}
                  </h2>
                  {(product.description || product.subLabel) && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500">
                      {product.description ?? product.subLabel}
                    </p>
                  )}
                </Link>

                <div className="flex items-center justify-between gap-3 pt-1">
                  {product.price != null ? (
                    <Link
                      href={`/product/${product.id}`}
                      className="text-sm tabular-nums text-stone-800 no-underline"
                    >
                      {formatPrice(product.price)}
                    </Link>
                  ) : (
                    <Link
                      href={`/product/${product.id}`}
                      className="text-sm text-stone-500 no-underline"
                    >
                      สอบถามราคา
                    </Link>
                  )}
                  <a
                    href={SITE_LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`สั่งซื้อ ${product.name} ทาง LINE`}
                    title="สั่งซื้อทาง LINE"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white transition hover:bg-stone-700"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="py-24 text-center text-sm text-stone-400">
          {searchQuery.trim()
            ? `ไม่พบสินค้าที่ตรงกับ "${searchQuery.trim()}"`
            : "ยังไม่มีสินค้าในหมวดนี้"}
        </p>
      )}

      {filteredProducts.length > PAGE_SIZE ? (
        <div className="mt-16 flex flex-col items-center gap-3 border-t border-stone-100 pt-10">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index)}
                aria-label={`หน้า ${index + 1}`}
                aria-current={index === safePage ? "page" : undefined}
                className={`h-1.5 rounded-full transition ${
                  index === safePage ? "w-6 bg-stone-900" : "w-1.5 bg-stone-200 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
          <p className="text-xs tracking-wide text-stone-400">
            {safePage + 1} / {totalPages}
          </p>
        </div>
      ) : null}
    </div>
  );
}
