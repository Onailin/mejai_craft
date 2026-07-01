"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BRACELET_STONE_PRICE, getBraceletImageClass, getBraceletImageFrameClass, isBraceletWorkshop } from "@/lib/workshop-bracelet-pricing";
import type { BraceletJewelryProductView } from "@/lib/bracelet-jewelry-products";
import { displayPendantDescription } from "@/lib/workshop-pendant-utils";
import {
  WORKSHOP_PLATING_OPTIONS,
  WORKSHOP_RING_SIZES,
  RING_PLATING_SAMPLE_IMAGE_CLASS,
  RING_SAMPLE_IMAGE_CLASS,
  isRingWorkshop,
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
import { WorkshopBanner } from "@/components/WorkshopBanner";

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
    <header className="max-w-xl">
      <h3 className="text-xl font-bold tracking-tight text-stone-900">{title}</h3>
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
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {sizes.map((sizeMm) => {
          const src = sampleMap.get(sizeToSampleType(sizeMm));
          const priceInfo = getSizePriceInfo(ringPrices, sizeMm);

          return (
            <figure key={sizeMm} className="text-center">
              {src ? (
                <img
                  src={src}
                  alt={`ขนาด ${sizeMm} มม.`}
                  className={RING_SAMPLE_IMAGE_CLASS}
                />
              ) : (
                <div className="mx-auto flex h-40 w-full max-w-[min(88vw,300px)] items-center justify-center text-sm text-stone-400 sm:max-w-[220px]">
                  ไม่มีรูป
                </div>
              )}
              <figcaption className="mt-4 space-y-1">
                <p className="text-lg font-bold text-stone-900">{sizeMm} มม.</p>
                {priceInfo?.price != null ? (
                  <>
                    <p className="text-base font-medium text-stone-900">{formatPrice(priceInfo.price)}</p>
                    {priceInfo.priceNote && (
                      <p className="text-xs text-stone-500">{priceInfo.priceNote}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-stone-600">
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
    <section className="border-t border-stone-100 pt-12">
      <SectionHeader title="ชุบสี" description={t("workshop.ring_plating_desc")} />
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {platings.map((plating) => {
          const src = sampleMap.get(platingToSampleType(plating.value));
          return (
            <figure key={plating.value} className="text-center">
              {src ? (
                <img
                  src={src}
                  alt={plating.label}
                  className={RING_PLATING_SAMPLE_IMAGE_CLASS}
                />
              ) : (
                <div className="mx-auto flex h-36 w-full max-w-[min(72vw,220px)] items-center justify-center text-sm text-stone-400">
                  ไม่มีรูป
                </div>
              )}
              <figcaption className="mt-3 text-sm font-bold text-stone-700">{plating.label}</figcaption>
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
    <section className="border-t border-stone-100 pt-10">
      <SectionHeader title="เลเซอร์และฝังพลอย" description={t("workshop.ring_addon_desc")} />
      <div className="mt-8 grid justify-items-center gap-10 sm:grid-cols-2">
        {addons.map((addon) => (
          <figure key={addon.addonType} className="w-full max-w-xs text-center">
            {addon.imageUrl ? (
              <img
                src={addon.imageUrl}
                alt={addon.label}
                className="mx-auto max-h-52 w-full object-contain sm:max-h-60"
              />
            ) : (
              <div className="mx-auto flex h-40 w-full max-w-[240px] items-center justify-center text-sm text-stone-400">
                ไม่มีรูป
              </div>
            )}
            <figcaption className="mt-4 space-y-1">
              <h4 className="text-base font-bold text-stone-900">{addon.label}</h4>
              {addon.price != null ? (
                <p className="text-sm font-medium text-stone-900">{formatPrice(addon.price)}</p>
              ) : (
                <p className="text-sm text-stone-600">
                  {addon.priceNote || t("workshop.price_inquire")}
                </p>
              )}
              {addon.priceNote && addon.price != null && (
                <p className="text-xs leading-relaxed text-stone-500">{addon.priceNote}</p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function BraceletStoneCard({
  label,
  price,
  imageUrl,
}: {
  label: string;
  price: number;
  imageUrl: string;
}) {
  return (
    <figure className="text-center">
      {imageUrl ? (
        <div className={getBraceletImageFrameClass("stone")}>
          <img src={imageUrl} alt={label} className={getBraceletImageClass("stone")} />
        </div>
      ) : (
        <div className={`${getBraceletImageFrameClass("stone")} text-sm text-stone-400`}>
          ไม่มีรูป
        </div>
      )}
      <figcaption className="mt-4 space-y-1">
        <p className="text-base font-bold text-stone-900">{label}</p>
        <p className="text-sm font-medium text-stone-900">{formatPrice(price)}</p>
      </figcaption>
    </figure>
  );
}

function BraceletPendantCard({
  label,
  description,
  price,
  imageUrl,
}: {
  label: string;
  description: string;
  price: number | null;
  imageUrl: string;
}) {
  return (
    <figure className="flex flex-col items-center text-center">
      {imageUrl ? (
        <div className={getBraceletImageFrameClass("pendant")}>
          <img src={imageUrl} alt={label} className={getBraceletImageClass("pendant")} />
        </div>
      ) : (
        <div className={`${getBraceletImageFrameClass("pendant")} text-sm text-stone-400`}>
          ไม่มีรูป
        </div>
      )}
      <figcaption className="mt-4 max-w-sm space-y-1">
        <p className="text-base font-bold text-stone-900">{label}</p>
        {description ? (
          <p className="text-sm leading-relaxed text-stone-500">{description}</p>
        ) : null}
        <p className="text-sm font-medium text-stone-900">
          {price != null ? formatPrice(price) : "สอบถามราคา"}
        </p>
      </figcaption>
    </figure>
  );
}

function getBraceletPendantOptions(workshop: WorkshopData) {
  return workshop.optionGroups.find((group) => group.groupType === "ADDON")?.options ?? [];
}

function BraceletOptionsSection({
  workshop,
  braceletProducts,
}: {
  workshop: WorkshopData;
  braceletProducts: BraceletJewelryProductView[];
}) {
  const pendantGroup = workshop.optionGroups.find((group) => group.groupType === "ADDON");
  const visiblePendants = pendantGroup?.options ?? [];
  const visibleStones = braceletProducts.filter((product) => product.imageUrl);

  return (
    <div className="border-t border-stone-100 pt-12">
      <header className="mb-10 max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400">
          Stone Bracelet
        </p>
        <h3 className="mt-2 text-xl font-bold text-stone-900">ตัวเลือกกำไลและจี้</h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">
          เลือกหินและจี้เสริมตามที่ร้านเปิดให้บริการ
        </p>
      </header>

      <div className="space-y-12">
        {visibleStones.length > 0 ? (
          <section>
            <SectionHeader
              title="กำไลหิน"
              description={`เลือกหินแต่ละชนิด ราคา ${formatPrice(BRACELET_STONE_PRICE)}`}
            />
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
              {visibleStones.map((product) => (
                <BraceletStoneCard
                  key={product.id}
                  label={product.title}
                  price={product.price ?? BRACELET_STONE_PRICE}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className={visibleStones.length > 0 ? "border-t border-stone-100 pt-10" : undefined}>
          <SectionHeader
            title={pendantGroup?.title || "จี้"}
            description={pendantGroup?.description || "เลือกจี้เสริมสำหรับกำไล"}
          />
          {visiblePendants.length > 0 ? (
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {visiblePendants.map((option) => (
                <BraceletPendantCard
                  key={option.id}
                  label={option.label}
                  description={displayPendantDescription(option.description)}
                  price={option.price}
                  imageUrl={option.imageUrl}
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-stone-500">ยังไม่มีรายการจี้</p>
          )}
        </section>
      </div>
    </div>
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
    <div className="border-t border-stone-100 pt-12">
      <header className="mb-10 max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400">Ring Workshop</p>
        <h3 className="mt-2 text-xl font-bold text-stone-900">{t("workshop.ring_options_title")}</h3>
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
        <h3 className="text-lg font-bold text-stone-900">{t("workshop.steps_title")}</h3>
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
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
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
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
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
    <article className="flex h-full flex-col items-center text-center sm:items-start sm:text-left">
      {option.imageUrl ? (
        <img
          src={option.imageUrl}
          alt={option.label}
          className="mb-4 max-h-36 w-auto object-contain"
        />
      ) : null}
      <h4 className="text-base font-bold text-stone-900">{option.label}</h4>
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
    <section className="border-t border-stone-100 py-10">
      <div className="mb-6 max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400">
          {group.groupType === "SIZE" && "Ring Size"}
          {group.groupType === "STYLE" && "Design"}
          {group.groupType === "PLATING" && "Plating"}
          {group.groupType === "ADDON" && "Add-on"}
          {group.groupType === "CUSTOM" && "Options"}
        </p>
        <h3 className="mt-2 text-xl font-bold text-stone-900">{group.title}</h3>
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
  braceletProducts,
  t,
  onBack,
}: {
  workshop: WorkshopData;
  braceletProducts: BraceletJewelryProductView[];
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

  const isBracelet = isBraceletWorkshop(workshop.slug, workshop.categorySlug);

  const hasRingOptions =
    isRingWorkshop(workshop.slug, workshop.categorySlug) &&
    (workshop.ringSampleImages.length > 0 ||
      workshop.ringPrices.length > 0 ||
      workshop.addons.length > 0);

  const nonBraceletGroups = sortedGroups.filter(
    (group) => !(isBracelet && (group.groupType === "ADDON" || group.groupType === "CUSTOM"))
  );

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
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
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

        <figure className="overflow-hidden">
          <div className="overflow-hidden rounded-2xl bg-stone-100">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${featuredIndex * 100}%)` }}
            >
              {workshop.featuredImages.map((imagePath) => (
                <img
                  key={imagePath}
                  className="aspect-[5/4] w-full shrink-0 object-cover"
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

      <div className="border-t border-stone-100 pt-10">
        <WorkshopMetaSection workshop={workshop} t={t} />
      </div>

      {hasRingOptions ? (
        <RingOptionsSection workshop={workshop} t={t} />
      ) : isBracelet ? (
        <BraceletOptionsSection workshop={workshop} braceletProducts={braceletProducts} />
      ) : (
        nonBraceletGroups.length > 0 && (
          <div>
            {nonBraceletGroups.map((group) => (
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

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <header className="mb-12 max-w-2xl pt-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400">Workshop</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          เลือกเวิร์คชอป
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">
          เลือกคอร์สที่สนใจ แล้วกดดูรายละเอียดเพื่อดูขั้นตอน ราคา และตัวเลือกเพิ่มเติม
        </p>
      </header>

      <div className="space-y-14">
        {workshops.map(({ category, workshop }, index) => {
          const image = getWorkshopImage(workshop, fallbackImage);
          const takeHome = getInfoValue(workshop, ["ได้รับ", "take-home", "take home"]);
          const duration = getInfoValue(workshop, ["ระยะเวลา", "duration", "time"]);

          return (
            <article key={workshop.id} className="space-y-6 border-b border-stone-100 pb-12 last:border-0">
              {image ? (
                <button
                  type="button"
                  onClick={() => onSelect(category.slug, workshop.slug)}
                  className="block w-full overflow-hidden"
                >
                  <img
                    src={image}
                    alt={workshop.title}
                    className="h-56 w-full object-cover transition duration-500 hover:scale-[1.01] sm:h-72"
                  />
                </button>
              ) : null}

              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_310px]">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs text-stone-400">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="text-2xl font-bold text-stone-900">{workshop.title}</h2>
                  </div>
                  {workshop.summary && (
                    <p className="mt-4 text-sm leading-relaxed text-stone-500">{workshop.summary}</p>
                  )}
                </div>

                <div className="space-y-4 text-sm">
                  {(takeHome || duration) && (
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-stone-600">
                      {takeHome && (
                        <p>
                          <span className="text-stone-400">ผลงาน · </span>
                          {takeHome}
                        </p>
                      )}
                      {duration && (
                        <p>
                          <span className="text-stone-400">เวลา · </span>
                          {duration}
                        </p>
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
  initialBraceletProducts,
  bannerImages = [],
}: {
  page: PageContent;
  initialCatalog: WorkshopCatalogView[];
  initialBraceletProducts: BraceletJewelryProductView[];
  bannerImages?: string[];
}) {
  const { t, i18n } = useTranslation();
  const [catalog, setCatalog] = useState(initialCatalog);
  const [braceletProducts, setBraceletProducts] = useState(initialBraceletProducts);
  const [bannerActiveIndex, setBannerActiveIndex] = useState(0);
  const [activeCategorySlug, setActiveCategorySlug] = useState(initialCatalog[0]?.slug ?? "");
  const [activeWorkshopSlug, setActiveWorkshopSlug] = useState(
    initialCatalog[0]?.workshops[0]?.slug ?? ""
  );
  const [viewMode, setViewMode] = useState<"overview" | "detail">("overview");

  useEffect(() => {
    const locale = i18n.resolvedLanguage ?? "th";
    if (locale === "th") {
      setCatalog(initialCatalog);
      setBraceletProducts(initialBraceletProducts);
      return;
    }
    Promise.all([
      fetch(`/api/content?type=workshop-catalog&locale=${locale}`).then((response) => response.json()),
      fetch(`/api/content?type=bracelet-products&locale=${locale}`).then((response) => response.json()),
    ])
      .then(([catalogData, braceletData]) => {
        if (Array.isArray(catalogData) && catalogData.length > 0) setCatalog(catalogData);
        if (braceletData?.products) setBraceletProducts(braceletData.products);
      })
      .catch(() => {
        setCatalog(initialCatalog);
        setBraceletProducts(initialBraceletProducts);
      });
  }, [i18n.resolvedLanguage, initialCatalog, initialBraceletProducts]);

  const activeCategory =
    catalog.find((category) => category.slug === activeCategorySlug) ?? catalog[0];

  const activeWorkshop =
    activeCategory?.workshops.find((workshop) => workshop.slug === activeWorkshopSlug) ??
    activeCategory?.workshops[0];

  useEffect(() => {
    if (!activeCategory) return;
    if (!activeCategory.workshops.some((workshop) => workshop.slug === activeWorkshopSlug)) {
      setActiveWorkshopSlug(activeCategory.workshops[0]?.slug ?? "");
    }
  }, [activeCategory, activeWorkshopSlug]);

  useEffect(() => {
    if (viewMode !== "overview" || bannerImages.length <= 1) return;
    const id = window.setInterval(
      () => setBannerActiveIndex((current) => (current + 1) % bannerImages.length),
      4000,
    );
    return () => window.clearInterval(id);
  }, [viewMode, bannerImages.length]);

  if (!catalog.length || !activeCategory || !activeWorkshop) {
    return <p className="px-6 text-sm text-stone-500">ยังไม่มีข้อมูลเวิร์คชอป</p>;
  }

  if (viewMode === "overview") {
    const bannerPage: PageContent =
      bannerImages.length > 0
        ? {
            ...page,
            cards: bannerImages.map((image, index) => ({
              title: `${page.title} ${index + 1}`,
              subtitle: page.cards[0]?.subtitle ?? "",
              description: page.cards[0]?.description ?? page.description,
              image,
              accent: page.cards[0]?.accent ?? "Workshop",
            })),
          }
        : page;

    return (
      <section className="pb-16">
        {bannerImages.length > 0 ? (
          <WorkshopBanner
            page={bannerPage}
            activeIndex={bannerActiveIndex}
            onSelectIndex={setBannerActiveIndex}
          />
        ) : null}
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
      <div className="mx-auto max-w-4xl space-y-10 px-6">
        <WorkshopDetail
          workshop={activeWorkshop}
          braceletProducts={braceletProducts}
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
