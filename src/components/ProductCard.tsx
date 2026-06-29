import type { ProductCard as ProductCardType } from "@/types";

export function ProductCard({ card }: { card: ProductCardType }) {
  return (
    <article className="group w-[84vw] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-stone-300 sm:w-auto sm:max-w-none">

      <div className="relative overflow-hidden rounded-md bg-stone-100">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className="block h-auto w-full transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex min-h-[160px] w-full items-center justify-center text-xs text-stone-400">
            ไม่มีรูป
          </div>
        )}

        {/* Accent Tag — ปรับให้ดูแพงขึ้น */}
        {card.accent && (
          <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.17em] text-stone-700 backdrop-blur-sm shadow-sm">
            {card.accent}
          </span>
        )}
      </div>

      {/* Text zone */}
      <div className="space-y-3 p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-400">
            {card.subtitle}
          </p>

          <h3 className="mt-1 font-serif text-xl text-stone-800">
            {card.title}
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-stone-500">
          {card.description}
        </p>
      </div>
    </article>
  );
}
