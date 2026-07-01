"use client";

import { useState } from "react";
import { HomeBanner } from "@/components/HomeBanner";
import { t } from "@/lib/copy";
import type { GemView, LuckyStoneView, PageContent } from "@/types";

type HomeViewProps = {
  page: PageContent;
  initialGems: GemView[];
  initialLuckyStones: LuckyStoneView[];
  bannerImage?: string;
};

export function HomeView({ page, initialGems, initialLuckyStones, bannerImage }: HomeViewProps) {
  const [selectedHardness, setSelectedHardness] = useState(9);

  const activeGems = initialGems.filter(
    (gem) => selectedHardness >= gem.hardnessMin && selectedHardness <= gem.hardnessMax
  );

  return (
    <>
      <HomeBanner page={page} bannerImage={bannerImage} />

      <section className="mx-auto mt-20 max-w-4xl px-6 text-center sm:mt-28">
        <h2 className="font-serif text-3xl font-light tracking-wide text-stone-800 sm:text-4xl">
          {t("home.brand_title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-500">
          {t("home.brand_desc")}
        </p>
        <div className="mx-auto mt-8 flex max-w-md justify-center gap-6 border-t border-stone-200 pt-8">
          {[t("home.tag_1"), t("home.tag_2"), t("home.tag_3")].map((item) => (
            <span key={item} className="text-xs uppercase tracking-[0.25em] text-stone-400">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-20 border-y border-stone-200 bg-stone-50 py-16 sm:mt-28 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 space-y-6 text-center sm:mb-16 sm:space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400">
                {t("home.interactive_label")}
              </p>
              <h2 className="font-serif text-2xl font-light leading-[1.12] tracking-wide text-stone-800 sm:text-3xl sm:leading-tight">
                {t("home.interactive_title")}
              </h2>
            </div>

            <div className="mx-auto max-w-4xl px-4">
              <div className="relative flex flex-col items-center">
                <div className="absolute -top-10 font-mono text-[7rem] font-bold leading-none text-stone-200/60 select-none">
                  {selectedHardness}
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={selectedHardness}
                  onChange={(e) => setSelectedHardness(Number(e.target.value))}
                  className="relative z-10 h-1 w-full cursor-pointer appearance-none bg-stone-300 accent-stone-800 focus:outline-none"
                />
                <div className="mt-4 flex w-full justify-between px-1 font-mono text-xs text-stone-400">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedHardness(num)}
                      className={`transition-all duration-300 ${
                        selectedHardness === num
                          ? "font-semibold scale-125 text-stone-800"
                          : "hover:text-stone-600"
                      }`}
                    >
                      {num === 10 ? "10 Mohs" : num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto grid max-w-3xl gap-5 pt-2 text-left sm:grid-cols-2 sm:gap-6">
              <article
                className={`border-l-2 py-3 pl-5 transition-all duration-500 ${
                  selectedHardness >= 7.5
                    ? "border-stone-800 bg-stone-100/60 shadow-sm"
                    : "border-stone-200 opacity-40"
                }`}
              >
                <h4 className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <span>{t("home.hard_gem_title")}</span>
                  {selectedHardness >= 7.5 ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-800" />
                  ) : null}
                </h4>
                <p className="mt-1 text-xs text-stone-500">{t("home.hard_gem_desc")}</p>
                <p className="mt-2 text-[11px] text-stone-400">{t("home.hard_gem_examples")}</p>
              </article>

              <article
                className={`border-l-2 py-3 pl-5 transition-all duration-500 ${
                  selectedHardness < 7.5
                    ? "border-stone-800 bg-stone-100/60 shadow-sm"
                    : "border-stone-200 opacity-40"
                }`}
              >
                <h4 className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <span>{t("home.soft_gem_title")}</span>
                  {selectedHardness < 7.5 ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-800" />
                  ) : null}
                </h4>
                <p className="mt-1 text-xs text-stone-500">{t("home.soft_gem_desc")}</p>
                <p className="mt-2 text-[11px] text-stone-400">{t("home.soft_gem_examples")}</p>
              </article>
            </div>
          </div>

          <div className="min-h-[280px]">
            {activeGems.length > 0 ? (
              <div className="space-y-3 sm:space-y-5">
                {activeGems.map((gem) => (
                  <article key={gem.id} className="px-1 py-1.5 sm:px-2">
                    <div className="flex items-start gap-2.5 sm:gap-5">
                      <div className="h-20 w-20 shrink-0 overflow-hidden bg-stone-100 sm:h-36 sm:w-40">
                        <img src={gem.image} alt={gem.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="inline-block bg-stone-800 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.14em] text-white sm:px-2 sm:text-[9px] sm:tracking-widest">
                          {gem.hardnessDisplay}
                        </span>
                        <h3 className="mt-1 font-serif text-[22px] font-light leading-[1.08] text-stone-800 sm:mt-2 sm:text-4xl">
                          {gem.name}
                        </h3>
                        <p className="mt-1 text-[11px] leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                          {gem.detail}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 sm:mt-4 sm:gap-8">
                          <div>
                            <p className="text-[7px] uppercase tracking-[0.12em] text-stone-400 sm:text-[9px] sm:tracking-wider">
                              {t("home.origin")}
                            </p>
                            <p className="text-[10px] text-stone-700 sm:text-xs">{gem.origin}</p>
                          </div>
                          <div>
                            <p className="text-[7px] uppercase tracking-[0.12em] text-stone-400 sm:text-[9px] sm:tracking-wider">
                              {t("home.color")}
                            </p>
                            <p className="text-[10px] text-stone-700 sm:text-xs">{gem.color}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-stone-400">
                <span className="font-serif text-xl font-light italic">
                  {t("home.no_gem_title", { hardness: selectedHardness })}
                </span>
                <p className="mt-1 max-w-xs text-xs">{t("home.no_gem_desc")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 sm:mt-28">
        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
            {t("home.collection_label")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-stone-800 sm:text-4xl">
            {t("home.collection_title")}
          </h2>
        </header>

        {initialGems.length === 0 ? (
          <p className="text-sm text-stone-500">ยังไม่มีข้อมูลอัญมณี</p>
        ) : (
          <div className="-mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {initialGems.map((gem) => (
              <article key={gem.id} className="group w-[78%] shrink-0 snap-start cursor-pointer sm:w-auto sm:shrink">
                <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={gem.image}
                    alt={gem.name}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg text-stone-800">{gem.name}</h3>
                    <span className="text-xs text-stone-400">{gem.hardnessDisplay}</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    {gem.origin} · {gem.color}
                  </p>
                  {gem.detail && (
                    <p className="text-sm leading-relaxed text-stone-500">{gem.detail}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 pb-20 sm:mt-28 sm:pb-28">
        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
            {t("home.lucky_label")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-stone-800 sm:text-4xl">
            {t("home.lucky_title")}
          </h2>
        </header>

        {initialLuckyStones.length === 0 ? (
          <p className="text-sm text-stone-500">ยังไม่มีข้อมูลหินนำโชค</p>
        ) : (
          <div className="-mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 pb-2">
            {initialLuckyStones.map((stone) => (
              <article
                key={stone.id}
                className="group w-[78%] shrink-0 snap-start cursor-pointer sm:w-[48%] lg:w-[32%] xl:w-[24%]"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
                  <img
                    src={stone.image}
                    alt={stone.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
                    {stone.meaning}
                  </p>
                  <h3 className="font-serif text-lg text-stone-800">{stone.name}</h3>
                  <p className="text-sm leading-relaxed text-stone-500">{stone.desc}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
