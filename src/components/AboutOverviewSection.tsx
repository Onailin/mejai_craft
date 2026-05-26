import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PageContent } from "../pages/types";

const SLIDES = [
  { id: "01", src: "/images/banner/album2.jpg", label: "Album 2" },
  { id: "02", src: "/images/banner/album3.jpg", label: "Album 3" },
  { id: "03", src: "/images/banner/album4.jpg", label: "Album 4" },
  { id: "04", src: "/images/banner/album5.jpg", label: "Album 5" },
  { id: "05", src: "/images/banner/banner.jpg", label: "Banner" },
  { id: "06", src: "/images/banner/banner4.jpg", label: "Banner 4" },
];

export function AboutOverviewSection({ page }: { page: PageContent }) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const goPrev = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  const goNext = () => setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:pt-14">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{page.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-light text-stone-800 sm:text-5xl">
          {t("about.title", { defaultValue: page.title })}
        </h1>
        <p className="mt-6 whitespace-pre-line text-sm leading-7 text-stone-600 sm:text-base">
          {t("about.intro", { defaultValue: page.description })}
        </p>
      </header>

      <div className="mx-auto mb-4 max-w-5xl px-2 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400">Photo Album</p>
        <p className="mt-2 text-xs text-stone-500 sm:text-sm">{t("about.photo_caption")}</p>
      </div>

      <section className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SLIDES.map((slide, index) => (
              <article key={slide.id} className="relative h-[68vh] min-h-[420px] w-full shrink-0 bg-stone-100 sm:h-[74vh]">
                <img
                  src={slide.src}
                  alt={slide.label}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-black/8" />
                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between text-white/85">
                  <p className="text-xs uppercase tracking-[0.24em]">{t("about.photo_caption")}</p>
                  <p className="font-serif text-sm tracking-[0.2em]">
                    {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/50 bg-black/25 px-3 py-2 text-white backdrop-blur hover:bg-black/40"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/50 bg-black/25 px-3 py-2 text-white backdrop-blur hover:bg-black/40"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        <div className="mx-auto mt-4 flex max-w-6xl justify-center gap-2 px-6">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === current ? "w-8 bg-stone-700" : "w-2 bg-stone-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </section>
  );
}