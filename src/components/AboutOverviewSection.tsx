"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PageContent } from "@/types";

type Slide = {
  id: string;
  src: string;
  label: string;
};

export function AboutOverviewSection({
  page,
  slides,
}: {
  page: PageContent;
  slides: Slide[];
}) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  if (slides.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:pt-14">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{page.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-stone-800 sm:text-5xl">
            {t("about.title", { defaultValue: page.title })}
          </h1>
          <p className="mt-6 whitespace-pre-line text-sm leading-7 text-stone-600 sm:text-base">
            {t("about.intro", { defaultValue: page.description })}
          </p>
        </header>
      </section>
    );
  }

  const goPrev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const goNext = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

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
            {slides.map((slide, index) => (
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
                    {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
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
      </section>
    </section>
  );
}
