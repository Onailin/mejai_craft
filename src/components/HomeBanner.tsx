"use client";

import type { PageContent } from "@/types";
import { useTranslation } from "react-i18next";

export function HomeBanner({ page }: { page: PageContent }) {
  const { t } = useTranslation();
  const heroCard = page.cards[0];
  const imageSrc = heroCard?.image;

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-gray-100">
      {imageSrc ? (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={imageSrc}
          alt={heroCard.title}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-white to-stone-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gray-500">
            {page.eyebrow}
          </p>
          <h1 className="font-sans text-5xl font-semibold leading-tight text-luxury-ink sm:text-6xl lg:text-7xl">
            {page.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-luxury-muted sm:text-lg">
            {page.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white no-underline shadow-sm hover:bg-gray-700"
              href="/jewelry"
            >
              {t("home_banner.cta_collection")}
            </a>
            <a
              className="rounded-full border border-gray-300 bg-white/75 px-6 py-3 text-sm font-semibold text-luxury-ink no-underline backdrop-blur hover:bg-white"
              href="/workshop"
            >
              {t("home_banner.cta_workshop")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
