import type { ProductCard as ProductCardType } from "@/types";

export function ProductCard({ card }: { card: ProductCardType }) {
  return (
    <article className="group w-[84vw] max-w-[360px] shrink-0 snap-center sm:w-auto sm:max-w-none">
      <div className="relative overflow-hidden bg-stone-100">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center text-xs tracking-wide text-stone-400">
            ไม่มีรูป
          </div>
        )}
      </div>

      <div className="space-y-1.5 pt-4">
        {card.subtitle ? (
          <p className="text-[10px] uppercase tracking-[0.22em] text-stone-400">{card.subtitle}</p>
        ) : null}

        <h3
          className="text-lg font-normal leading-snug text-stone-900"
          style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
        >
          {card.title}
        </h3>

        {card.description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">{card.description}</p>
        ) : null}

        {card.accent ? (
          <p className="text-xs tracking-wide text-stone-400">{card.accent}</p>
        ) : null}
      </div>
    </article>
  );
}
