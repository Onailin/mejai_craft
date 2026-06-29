import { ProductCard } from "./ProductCard";
import type { PageContent } from "@/types";

export function PageCardsSection({
  page,
  isHome,
}: {
  page: PageContent;
  isHome?: boolean;
}) {
  return (
    <section
      className={
        isHome
          ? "mx-auto mt-12 max-w-7xl px-4 sm:mt-16 sm:px-6 lg:px-8"
          : "mt-12 sm:mt-16"
      }
    >
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Selected Boxes</p>
          <h2 className="mt-2 font-sans text-3xl font-semibold text-luxury-ink sm:text-4xl">
            {page.navLabel}
          </h2>
        </div>
        <div />
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
        {page.cards.map((card) => (
          <ProductCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
