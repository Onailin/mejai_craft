import Image from "next/image";
import type { PageContent } from "@/types";
import { t } from "@/lib/copy";

export function WorkshopBanner({
  page,
  activeIndex,
  onSelectIndex,
}: {
  page: PageContent;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-stone-200">
      <div
        className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {page.cards.map((card, index) => (
          <div
            key={`${card.image}-${index}`}
            className="relative h-[min(72vh,560px)] w-full shrink-0 sm:h-[min(78vh,640px)]"
          >
            <Image
              className="object-cover"
              src={card.image}
              alt={card.title}
              fill
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone-950/75 via-stone-900/35 to-stone-900/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-stone-900/10" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="max-w-2xl text-white">
            <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-white/70">
              {page.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              {page.title}
            </h1>
            <div className="mt-6 flex max-w-[200px] items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-white/70 to-white/20" />
              <span className="text-[10px] text-white/50" aria-hidden>
                ✦
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-white/70 to-white/20" />
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
              {page.description}
            </p>
            <a
              href="https://www.facebook.com/mejaicrafts"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-medium text-stone-900 no-underline shadow-lg shadow-black/10 transition hover:bg-stone-100"
            >
              {t("workshop.book_button")}
            </a>
          </div>
        </div>
      </div>

      {page.cards.length > 1 ? (
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 px-6 pb-8 sm:pb-10">
          {page.cards.map((card, index) => (
            <button
              type="button"
              key={`${card.image}-${index}`}
              onClick={() => onSelectIndex(index)}
              className={`h-px rounded-full transition-all duration-500 ${
                activeIndex === index ? "w-10 bg-white" : "w-6 bg-white/35 hover:bg-white/55"
              }`}
              aria-label={t("workshop.banner_slide_aria", { index: index + 1 })}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
