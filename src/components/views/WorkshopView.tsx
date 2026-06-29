"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  WORKSHOP_PLATING_OPTIONS,
  WORKSHOP_RING_SIZES,
  platingToSampleType,
  sizeToSampleType,
  type WorkshopRingSampleType,
} from "@/lib/workshop-ring-pricing";
import type {
  PageContent,
  WorkshopCatalogView,
  WorkshopOptionGroupView,
  WorkshopOptionView,
  WorkshopRingPriceView,
  WorkshopRingSampleView,
  WorkshopAddonView,
  WorkshopView as WorkshopData,
} from "@/types";

function formatPrice(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

function getSizePriceInfo(ringPrices: WorkshopRingPriceView[], sizeMm: number) {
  const row =
    ringPrices.find(
      (item) => item.sizeMm === sizeMm && item.style === "CLASSIC" && item.plating === "WHITE_GOLD"
    ) ?? ringPrices.find((item) => item.sizeMm === sizeMm);
  if (!row) return null;
  return { price: row.price, priceNote: row.priceNote };
}

function buildSampleMap(samples: WorkshopRingSampleView[]) {
  return new Map(samples.map((sample) => [sample.sampleType, sample.imageUrl]));
}

function shouldHideMetaText(text: string) {
  const normalized = text.toLowerCase();
  return (
    normalized.includes("แหวนเกลี้ยง") ||
    normalized.includes("แหวนทุบ") ||
    normalized.includes("classic") ||
    normalized.includes("texture")
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="max-w-2xl">
      <h3 className="text-2xl font-medium tracking-tight text-stone-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>
    </header>
  );
}

function SizeSamplesSection({
  sampleMap,
  ringPrices,
  t,
}: {
  sampleMap: Map<WorkshopRingSampleType, string>;
  ringPrices: WorkshopRingPriceView[];
  t: (key: string) => string;
}) {
  const sizes = WORKSHOP_RING_SIZES.filter(
    (sizeMm) => sampleMap.has(sizeToSampleType(sizeMm)) || getSizePriceInfo(ringPrices, sizeMm)
  );
  if (!sizes.length) return null;

  return (
    <section>
      <SectionHeader title="ขนาดหน้ากว้าง" description={t("workshop.ring_size_desc")} />
      <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
        {sizes.map((sizeMm) => {
          const src = sampleMap.get(sizeToSampleType(sizeMm));
          const priceInfo = getSizePriceInfo(ringPrices, sizeMm);

          return (
            <figure key={sizeMm} className="group">
              {src ? (
                <img
                  src={src}
                  alt={`ขนาด ${sizeMm} มม.`}
                  className="aspect-square w-full bg-stone-50 object-contain transition duration-300 group-hover:scale-[1.015]"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-stone-100 text-sm text-stone-400">
                  ไม่มีรูป
                </div>
              )}
              <figcaption className="pt-4">
                <div className="flex items-baseline justify-between gap-3 border-b border-stone-200 pb-3">
                  <p className="text-2xl font-light text-stone-900">{sizeMm} มม.</p>
                  {priceInfo?.price != null ? (
                    <p className="text-xl font-semibold text-stone-900">
                      {formatPrice(priceInfo.price)}
                    </p>
                  ) : null}
                </div>
                {priceInfo?.price != null ? (
                  priceInfo.priceNote && (
                    <p className="mt-2 text-xs text-stone-500">{priceInfo.priceNote}</p>
                  )
                ) : (
                  <p className="mt-2 text-sm text-stone-600">
                    {priceInfo?.priceNote || t("workshop.price_inquire")}
                  </p>
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function PlatingSamplesSection({
  sampleMap,
  t,
}: {
  sampleMap: Map<WorkshopRingSampleType, string>;
  t: (key: string) => string;
}) {
  const platings = WORKSHOP_PLATING_OPTIONS.filter((plating) =>
    sampleMap.has(platingToSampleType(plating.value))
  );
  if (!platings.length) return null;

  return (
    <section className="border-t border-stone-200 pt-12">
      <SectionHeader title="ชุบสี" description={t("workshop.ring_plating_desc")} />
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {platings.map((plating) => {
          const src = sampleMap.get(platingToSampleType(plating.value));
          return (
            <figure key={plating.value}>
              {src ? (
                <img
                  src={src}
                  alt={plating.label}
                  className="mx-auto aspect-square w-full max-w-[220px] bg-stone-50 object-contain"
                />
              ) : (
                <div className="mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center bg-stone-100 text-sm text-stone-400">
                  ไม่มีรูป
                </div>
              )}
              <figcaption className="mt-4 text-center text-sm font-medium text-stone-800">
                {plating.label}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function AddonSamplesSection({
  addons,
  t,
}: {
  addons: WorkshopAddonView[];
  t: (key: string) => string;
}) {
  if (!addons.length) return null;

  return (
    <section className="border-t border-stone-200 pt-10">
      <SectionHeader title="เลเซอร์และฝังพลอย" description={t("workshop.ring_addon_desc")} />
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {addons.map((addon) => (
          <article
            key={addon.addonType}
            className="space-y-4 border-b border-stone-200 pb-8 last:border-b-0 md:border-b-0 md:pb-0"
          >
            {addon.imageUrl ? (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-stone-50">
                <img
                  src={addon.imageUrl}
                  alt={addon.label}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full bg-stone-100" />
            )}
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-stone-900">{addon.label}</h4>
              {addon.price != null ? (
                <p className="mt-1 text-sm font-semibold text-stone-900">{formatPrice(addon.price)}</p>
              ) : (
                <p className="mt-1 text-sm font-medium text-stone-700">
                  {addon.priceNote || t("workshop.price_inquire")}
                </p>
              )}
              {addon.priceNote && addon.price != null && (
                <p className="mt-1 text-xs leading-relaxed text-stone-500">{addon.priceNote}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RingOptionsSection({
  workshop,
  t,
}: {
  workshop: WorkshopData;
  t: (key: string) => string;
}) {
  const sampleMap = buildSampleMap(workshop.ringSampleImages);
  const hasSizes =
    WORKSHOP_RING_SIZES.some(
      (sizeMm) => sampleMap.has(sizeToSampleType(sizeMm)) || getSizePriceInfo(workshop.ringPrices, sizeMm)
    ) || workshop.ringPrices.length > 0;
  const hasPlating = WORKSHOP_PLATING_OPTIONS.some((plating) =>
    sampleMap.has(platingToSampleType(plating.value))
  );
  const hasAddons = workshop.addons.length > 0;

  if (!hasSizes && !hasPlating && !hasAddons) return null;

  return (
    <div className="border-t border-stone-200 pt-12">
      <header className="mb-10 max-w-3xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400">Ring Workshop</p>
        <h3 className="mt-2 text-2xl font-light text-stone-900">{t("workshop.ring_options_title")}</h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">{t("workshop.ring_options_intro")}</p>
      </header>

      <div className="space-y-12">
        {hasSizes && (
          <SizeSamplesSection sampleMap={sampleMap} ringPrices={workshop.ringPrices} t={t} />
        )}
        {hasPlating && <PlatingSamplesSection sampleMap={sampleMap} t={t} />}
        {hasAddons && <AddonSamplesSection addons={workshop.addons} t={t} />}
      </div>
    </div>
  );
}

function WorkshopMetaSection({
  workshop,
  t,
}: {
  workshop: WorkshopData;
  t: (key: string) => string;
}) {
  const visibleSteps = workshop.classSteps.filter(
    (step) => !shouldHideMetaText(`${step.title} ${step.description}`)
  );
  const visibleReceivedItems = workshop.receivedItems.filter((item) => !shouldHideMetaText(item));
  const visibleBookingTerms = workshop.bookingTerms.filter((term) => !shouldHideMetaText(term));

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <article>
        <h3 className="text-lg font-medium text-stone-900">{t("workshop.steps_title")}</h3>
        <div className="mt-6 space-y-5">
          {visibleSteps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-4">
              <span className="shrink-0 text-xs font-medium text-stone-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-medium text-stone-900">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <div className="space-y-8">
        <article>
          <h3 className="text-sm font-medium uppercase tracking-wider text-stone-900">
            {t("workshop.received_title")}
          </h3>
          <ul className="mt-4 space-y-3">
            {visibleReceivedItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-stone-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="border-t border-stone-200 pt-8">
          <h3 className="text-sm font-medium uppercase tracking-wider text-stone-900">
            {t("workshop.terms_title")}
          </h3>
          <ul className="mt-4 space-y-3">
            {visibleBookingTerms.map((term) => (
              <li key={term} className="flex items-start gap-3 text-sm leading-relaxed text-stone-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
                {term}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

function OptionCard({ option }: { option: WorkshopOptionView }) {
  return (
    <article className="flex h-full flex-col">
      {option.imageUrl ? (
        <div className="mb-4 aspect-[4/3] overflow-hidden bg-stone-100">
          <img src={option.imageUrl} alt={option.label} className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="mb-4 flex aspect-[4/3] items-center justify-center bg-stone-50 text-xs text-stone-400">
          รูปตัวอย่างเร็วๆ นี้
        </div>
      )}
      <h4 className="text-base font-medium text-stone-900">{option.label}</h4>
      {option.description && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">{option.description}</p>
      )}
    </article>
  );
}

function OptionGroupSection({ group }: { group: WorkshopOptionGroupView }) {
  const gridClass =
    group.groupType === "SIZE"
      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
      : group.groupType === "STYLE"
        ? "grid gap-6 sm:grid-cols-2"
        : group.groupType === "PLATING"
          ? "grid gap-6 sm:grid-cols-3"
          : "grid gap-6 sm:grid-cols-2";

  return (
    <section className="border-t border-stone-200 py-10">
      <div className="mb-6 max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400">
          {group.groupType === "SIZE" && "Ring Size"}
          {group.groupType === "STYLE" && "Design"}
          {group.groupType === "PLATING" && "Plating"}
          {group.groupType === "ADDON" && "Add-on"}
          {group.groupType === "CUSTOM" && "Options"}
        </p>
        <h3 className="mt-2 text-xl font-light text-stone-900">{group.title}</h3>
        {group.description && (
          <p className="mt-2 text-sm leading-relaxed text-stone-500">{group.description}</p>
        )}
      </div>

      <div className={gridClass}>
        {group.options.map((option) => (
          <OptionCard key={option.id} option={option} />
        ))}
      </div>
    </section>
  );
}

function WorkshopDetail({
  workshop,
  t,
  onBack,
}: {
  workshop: WorkshopData;
  t: (key: string) => string;
  onBack: () => void;
}) {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    if (workshop.featuredImages.length <= 1) return;
    const id = window.setInterval(
      () => setFeaturedIndex((current) => (current + 1) % workshop.featuredImages.length),
      3500
    );
    return () => window.clearInterval(id);
  }, [workshop.featuredImages.length]);

  const sortedGroups = useMemo(() => {
    const order = ["STYLE", "SIZE", "PLATING", "ADDON", "CUSTOM"];
    return [...workshop.optionGroups].sort(
      (a, b) => order.indexOf(a.groupType) - order.indexOf(b.groupType)
    );
  }, [workshop.optionGroups]);

  const hasRingOptions =
    workshop.ringSampleImages.length > 0 ||
    workshop.ringPrices.length > 0 ||
    workshop.addons.length > 0;

  return (
    <div className="space-y-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex border-b border-stone-900 pb-1 text-sm text-stone-800 transition hover:text-stone-500"
      >
        ← กลับไปเลือกเวิร์คชอป
      </button>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <article className="space-y-6">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400">
              {workshop.categoryName}
            </span>
            <h2 className="mt-2 text-3xl font-light tracking-tight text-stone-900 sm:text-4xl">
              {workshop.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-500">{workshop.summary}</p>
          </div>

          <a
            href="https://www.facebook.com/mejaicrafts"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white no-underline transition hover:bg-stone-700"
          >
            {t("workshop.book_button")}
          </a>

          <div className="grid gap-4 sm:grid-cols-2">
            {workshop.infoCards.map((card) => (
              <div key={card.label} className="border-b border-stone-200 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400">{card.label}</p>
                <p className="mt-1 text-sm text-stone-700">{card.value}</p>
              </div>
            ))}
          </div>
        </article>

        <figure>
          <div className="overflow-hidden bg-stone-100">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${featuredIndex * 100}%)` }}
            >
              {workshop.featuredImages.map((imagePath) => (
                <img
                  key={imagePath}
                  className="aspect-[4/3] w-full shrink-0 bg-stone-50 object-contain"
                  src={imagePath}
                  alt={workshop.featuredTitle}
                />
              ))}
            </div>
          </div>
          <figcaption className="mt-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
              {workshop.featuredSubtitle}
            </p>
            <p className="mt-1 text-base font-medium text-stone-900">{workshop.featuredTitle}</p>
          </figcaption>
        </figure>
      </div>

      <div className="border-t border-stone-200 pt-10">
        <WorkshopMetaSection workshop={workshop} t={t} />
      </div>

      {hasRingOptions ? (
        <RingOptionsSection workshop={workshop} t={t} />
      ) : (
        sortedGroups.length > 0 && (
          <div>
            {sortedGroups.map((group) => (
              <OptionGroupSection key={group.id} group={group} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function getWorkshopImage(workshop: WorkshopData, fallback?: string) {
  return workshop.featuredImages[0] ?? workshop.bannerImages[0] ?? fallback ?? "";
}

function getInfoValue(workshop: WorkshopData, keywords: string[]) {
  const card = workshop.infoCards.find((item) =>
    keywords.some((keyword) => `${item.label} ${item.value}`.toLowerCase().includes(keyword.toLowerCase()))
  );
  return card?.value ?? "";
}

function WorkshopOverview({
  catalog,
  page,
  onSelect,
}: {
  catalog: WorkshopCatalogView[];
  page: PageContent;
  onSelect: (categorySlug: string, workshopSlug: string) => void;
}) {
  const workshops = catalog.flatMap((category) =>
    category.workshops.map((workshop) => ({ category, workshop }))
  );
  const fallbackImage = page.cards.map((card) => card.image).find(Boolean);
  const heroImage = fallbackImage ?? workshops.map(({ workshop }) => getWorkshopImage(workshop)).find(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-16">
      <header className="mb-12">
        {heroImage && (
          <div className="mb-8 flex aspect-[16/7] items-center justify-center overflow-hidden bg-stone-100">
            <img
              src={heroImage}
              alt={page.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
        <div className="max-w-2xl border-b border-stone-200 pb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400">Workshop</p>
          <h1 className="mt-3 text-3xl font-light tracking-tight text-stone-900 sm:text-4xl">
            เลือกเวิร์คชอป
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">
            เลือกคอร์สที่สนใจ แล้วกดดูรายละเอียดเพื่อดูขั้นตอน ราคา และตัวเลือกเพิ่มเติม
          </p>
        </div>
      </header>

      <div className="space-y-16">
        {workshops.map(({ category, workshop }, index) => {
          const image = getWorkshopImage(workshop, fallbackImage);
          const takeHome = getInfoValue(workshop, ["ได้รับ", "take-home", "take home"]);
          const duration = getInfoValue(workshop, ["ระยะเวลา", "duration", "time"]);

          return (
            <article key={workshop.id} className="space-y-6 border-b border-dashed border-stone-300 pb-10 last:border-0">
              {image ? (
                <button
                  type="button"
                  onClick={() => onSelect(category.slug, workshop.slug)}
                  className="block w-full overflow-hidden bg-stone-100"
                >
                  <img src={image} alt={workshop.title} className="aspect-[16/9] w-full bg-stone-50 object-contain" />
                </button>
              ) : null}

              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_310px]">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs text-stone-400">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="text-2xl font-light text-stone-900">{workshop.title}</h2>
                  </div>
                  {workshop.summary && (
                    <p className="mt-4 text-sm leading-relaxed text-stone-500">{workshop.summary}</p>
                  )}
                </div>

                <div className="space-y-4 text-sm">
                  {(takeHome || duration) && (
                    <div className="grid grid-cols-[120px_minmax(0,1fr)] border-y border-stone-200">
                      {takeHome && (
                        <>
                          <div className="bg-stone-900 px-4 py-3 text-white">ผลงาน</div>
                          <div className="px-4 py-3 text-stone-600">{takeHome}</div>
                        </>
                      )}
                      {duration && (
                        <>
                          <div className="bg-stone-900 px-4 py-3 text-white">เวลา</div>
                          <div className="px-4 py-3 text-stone-600">{duration}</div>
                        </>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelect(category.slug, workshop.slug)}
                    className="ml-auto flex w-fit items-center gap-8 border-b border-stone-900 pb-2 text-stone-800 transition hover:text-stone-500"
                  >
                    ดูรายละเอียดเวิร์คชอป
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function WorkshopView({
  page,
  initialCatalog,
}: {
  page: PageContent;
  initialCatalog: WorkshopCatalogView[];
}) {
  const { t, i18n } = useTranslation();
  const [catalog, setCatalog] = useState(initialCatalog);
  const [activeCategorySlug, setActiveCategorySlug] = useState(initialCatalog[0]?.slug ?? "");
  const [activeWorkshopSlug, setActiveWorkshopSlug] = useState(
    initialCatalog[0]?.workshops[0]?.slug ?? ""
  );
  const [viewMode, setViewMode] = useState<"overview" | "detail">("overview");
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const locale = i18n.resolvedLanguage ?? "th";
    if (locale === "th") {
      setCatalog(initialCatalog);
      return;
    }
    fetch(`/api/content?type=workshop-catalog&locale=${locale}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCatalog(data);
      })
      .catch(() => setCatalog(initialCatalog));
  }, [i18n.resolvedLanguage, initialCatalog]);

  const activeCategory =
    catalog.find((category) => category.slug === activeCategorySlug) ?? catalog[0];

  const activeWorkshop =
    activeCategory?.workshops.find((workshop) => workshop.slug === activeWorkshopSlug) ??
    activeCategory?.workshops[0];

  const bannerImages = useMemo(() => {
    if (!activeWorkshop?.bannerImages?.length) {
      return page.cards.map((card) => card.image).filter(Boolean);
    }
    return activeWorkshop.bannerImages;
  }, [activeWorkshop, page.cards]);

  useEffect(() => {
    if (!activeCategory) return;
    if (!activeCategory.workshops.some((workshop) => workshop.slug === activeWorkshopSlug)) {
      setActiveWorkshopSlug(activeCategory.workshops[0]?.slug ?? "");
    }
  }, [activeCategory, activeWorkshopSlug]);

  useEffect(() => {
    setBannerIndex(0);
  }, [activeWorkshop?.id]);

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const id = window.setInterval(
      () => setBannerIndex((current) => (current + 1) % bannerImages.length),
      4000
    );
    return () => window.clearInterval(id);
  }, [bannerImages.length]);

  if (!catalog.length || !activeCategory || !activeWorkshop) {
    return <p className="px-6 text-sm text-stone-500">ยังไม่มีข้อมูลเวิร์คชอป</p>;
  }

  if (viewMode === "overview") {
    return (
      <section className="pb-16">
        <WorkshopOverview
          catalog={catalog}
          page={page}
          onSelect={(categorySlug, workshopSlug) => {
            setActiveCategorySlug(categorySlug);
            setActiveWorkshopSlug(workshopSlug);
            setViewMode("detail");
            window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
          }}
        />
      </section>
    );
  }

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden bg-stone-100">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
          >
            {bannerImages.map((src) => (
              <img
                key={src}
                className="aspect-[16/7] w-full shrink-0 bg-stone-50 object-contain"
                src={src}
                alt={activeWorkshop.title}
              />
            ))}
          </div>
          {bannerImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setBannerIndex(index)}
                  className={`h-1.5 rounded-full transition ${
                    bannerIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                  aria-label={t("workshop.banner_slide_aria", { index: index + 1 })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl space-y-10 px-6">
        <WorkshopDetail
          workshop={activeWorkshop}
          t={t}
          onBack={() => {
            setViewMode("overview");
            window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
          }}
        />
      </div>
    </section>
  );
}
