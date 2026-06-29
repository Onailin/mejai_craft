"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Gem,
  LayoutGrid,
  PenLine,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
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

const PAGE_SIZE = 9;

function formatPrice(value: number) {
  return `฿${value.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getCategoryIcon(slug: string): LucideIcon {
  if (slug === "all") return LayoutGrid;
  if (slug.includes("ring") || slug.includes("แหวน")) return Gem;
  if (slug.includes("pen") || slug.includes("ปากกา")) return PenLine;
  if (slug.includes("necklace") || slug.includes("สร้อย")) return Sparkle;
  return LayoutGrid;
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
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!navCategories.some((category) => category.id === activeCategory)) {
      setActiveCategory("all");
    }
  }, [navCategories, activeCategory]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

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

  const categoryButtonClass = (isActive: boolean, compact: boolean) =>
    compact
      ? `flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition ${
          isActive
            ? "bg-stone-900 font-medium text-white"
            : "bg-stone-50 text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
        }`
      : `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
          isActive
            ? "bg-stone-900 font-medium text-white"
            : "text-stone-600 hover:bg-stone-100"
        }`;

  function CategoryNav({ compact = false }: { compact?: boolean }) {
    return (
      <nav
        className={
          compact
            ? "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "space-y-1"
        }
        aria-label="หมวดสินค้า"
      >
        {navCategories.map((category) => {
          const isActive = category.id === activeCategory;
          const Icon = getCategoryIcon(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={categoryButtonClass(isActive, compact)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{category.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[90rem] px-5 pb-20 pt-4 font-sans text-stone-900 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm lg:sticky lg:top-36">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
              หมวดสินค้า
            </p>
            <div className="lg:hidden">
              <CategoryNav compact />
            </div>
            <div className="hidden lg:block">
              <CategoryNav />
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <h1 className="text-2xl font-bold text-stone-900">{activeCategoryLabel}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-stone-500">{filteredProducts.length} รายการ</span>
              <a
                href={SITE_LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#06C755] px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-[#05b34c]"
              >
                สอบถาม / สั่งซื้อทาง LINE
              </a>
            </div>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:border-stone-300 hover:shadow-sm no-underline"
                >
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-stone-50 p-3">
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
                  </div>

                  <div className="flex flex-col gap-1 border-t border-stone-100 p-3 sm:p-3.5">
                    <h2 className="line-clamp-1 text-sm font-semibold text-stone-900">
                      {product.name}
                    </h2>
                    {product.subLabel && product.description ? (
                      <p className="line-clamp-1 text-xs text-stone-500">{product.subLabel}</p>
                    ) : null}
                    {(product.description || product.subLabel) && (
                      <p className="line-clamp-1 text-xs leading-relaxed text-stone-600">
                        {product.description ?? product.subLabel}
                      </p>
                    )}
                    <div className="pt-1.5">
                      {product.price != null ? (
                        <p className="text-sm font-bold text-stone-900">{formatPrice(product.price)}</p>
                      ) : (
                        <p className="text-xs text-stone-500">สอบถามราคา</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-stone-500">ยังไม่มีสินค้าในหมวดนี้</div>
          )}

          {filteredProducts.length > PAGE_SIZE && (
            <div className="mt-10 flex flex-col items-center gap-3 border-t border-stone-100 pt-8">
              <div className="flex items-center gap-2.5">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index)}
                    aria-label={`หน้า ${index + 1}`}
                    className={`h-3 rounded-full transition ${
                      index === safePage ? "w-8 bg-stone-900" : "w-3 bg-stone-200 hover:bg-stone-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-stone-500">
                หน้า {safePage + 1} จาก {totalPages}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
