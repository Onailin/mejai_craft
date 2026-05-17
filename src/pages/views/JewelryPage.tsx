import { useState } from "react";
import { PageHero } from "../../components/PageHero";
import { ProductCard } from "../../components/ProductCard";
import { jewelryCatalog, jewelryCategoryTabs, type JewelryCategoryKey } from "../../data/jewelryCatalog";
import type { PageContent } from "../types";

export function JewelryPage({ page }: { page: PageContent }) {
  const [activeCategory, setActiveCategory] = useState<JewelryCategoryKey>("ring");

  const selectedCards = jewelryCatalog[activeCategory];

  return (
    <>
      <PageHero page={page} />

      <section className="mx-auto mt-16 max-w-7xl px-6 sm:mt-24">
        
        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {jewelryCategoryTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm tracking-wide transition
                  ${
                    isActive
                      ? "bg-stone-900 text-white"
                      : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-10 sm:overflow-visible xl:grid-cols-3">
          {selectedCards.map((card) => (
            <ProductCard key={`${activeCategory}-${card.title}`} card={card} />
          ))}
        </div>
      </section>
    </>
  );
}
