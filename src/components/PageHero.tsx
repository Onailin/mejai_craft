import type { PageContent } from "../pages/types";
import { useTranslation } from "react-i18next";

export function PageHero({ page }: { page: PageContent }) {
  const { t } = useTranslation();

  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gray-500">
          {page.eyebrow}
        </p>
        <h1 className="font-sans text-4xl font-semibold leading-tight text-luxury-ink sm:text-5xl lg:text-6xl">
          {page.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-luxury-muted sm:text-lg">
          {page.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_16px_40px_rgba(31,41,55,0.18)] hover:bg-gray-700"
            href="#workshop"
          >
            {t("page_hero.cta_workshop")}
          </a>
          <a
            className="rounded-full border border-gray-300 bg-white/70 px-6 py-3 text-sm font-semibold text-luxury-ink no-underline hover:border-gray-500 hover:bg-white"
            href="#jewelry"
          >
            {t("page_hero.cta_jewelry")}
          </a>
        </div>
      </div>

      <div className="relative hidden min-h-[390px] lg:block">
        <div className="relative ml-auto max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
          <img
            className="h-[370px] w-full rounded-2xl object-cover"
            src={page.cards[0].image}
            alt={page.cards[0].title}
          />
          <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/70 bg-white/85 p-5 backdrop-blur-md">
            <p className="font-sans text-2xl text-luxury-ink">{page.cards[0].title}</p>
            <p className="mt-2 text-sm leading-6 text-luxury-muted">{page.cards[0].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
