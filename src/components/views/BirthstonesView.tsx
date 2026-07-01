"use client";

import { isDisplayableImageUrl } from "@/lib/image-urls";
import { t } from "@/lib/copy";
import type { BirthstoneView } from "@/types";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center sm:text-left">
      <dt className="text-[10px] uppercase tracking-[0.22em] text-stone-400">{label}</dt>
      <dd className="mt-1.5 text-sm font-light text-stone-700">{value}</dd>
    </div>
  );
}

function BirthstoneCard({ stone }: { stone: BirthstoneView }) {
  const displayGem = stone.gemName && stone.gemName !== stone.day ? stone.gemName : null;

  return (
    <article className="mx-auto w-full max-w-md sm:max-w-none">
      <div className="overflow-hidden rounded-xl bg-[#f8f7f4] ring-1 ring-stone-200/60">
        <div className="flex aspect-[4/5] items-center justify-center p-6 sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stone.image}
            alt={stone.day}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-5 space-y-4 px-1 text-center sm:mt-6 sm:px-0 sm:text-left">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">{stone.day}</p>
          {displayGem ? (
            <p className="text-base font-normal text-stone-800 sm:text-lg">{displayGem}</p>
          ) : null}
          {stone.gemNameEn ? (
            <p className="text-sm font-light italic text-stone-500">{stone.gemNameEn}</p>
          ) : null}
        </div>

        {(stone.color || stone.origin || stone.hardness) && (
          <dl className="grid gap-4 border-t border-stone-200/70 pt-4 sm:grid-cols-3 sm:gap-3">
            {stone.color ? <MetaItem label={t("birthstones.color")} value={stone.color} /> : null}
            {stone.origin ? <MetaItem label={t("birthstones.origin")} value={stone.origin} /> : null}
            {stone.hardness ? <MetaItem label={t("birthstones.hardness")} value={stone.hardness} /> : null}
          </dl>
        )}

        {stone.detail ? (
          <p className="border-t border-stone-200/70 pt-4 text-sm font-light leading-relaxed text-stone-600">
            {stone.detail}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function BirthstonesView({ initialBirthstones }: { initialBirthstones: BirthstoneView[] }) {
  const visibleBirthstones = initialBirthstones.filter((stone) => isDisplayableImageUrl(stone.image));

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-4 sm:px-8 lg:px-10">
      <header className="mx-auto mb-12 max-w-xl text-center sm:mb-16">
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
          {t("birthstones.eyebrow")}
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-wide text-stone-900 sm:text-3xl">
          {t("birthstones.title")}
        </h1>
        <p className="mt-4 text-sm font-light leading-relaxed text-stone-600 sm:text-[15px]">
          {t("birthstones.intro")}
        </p>
      </header>

      {visibleBirthstones.length === 0 ? (
        <div className="mx-auto max-w-md rounded-xl border border-dashed border-stone-300/80 bg-stone-50/80 px-6 py-14 text-center">
          <p className="text-sm font-light text-stone-700">{t("birthstones.empty_title")}</p>
          <p className="mt-2 text-xs font-light text-stone-500">{t("birthstones.empty_desc")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-14 sm:grid sm:grid-cols-2 sm:gap-x-10 sm:gap-y-16 lg:gap-x-12 lg:gap-y-20">
          {visibleBirthstones.map((stone) => (
            <BirthstoneCard key={stone.id} stone={stone} />
          ))}
        </div>
      )}
    </div>
  );
}
