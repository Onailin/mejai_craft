"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Gem } from "lucide-react";
import { t } from "@/lib/copy";
import { BRACELET_STONE_PRICE, getBraceletImageClass, getBraceletImageFrameClass, isBraceletWorkshop } from "@/lib/workshop-bracelet-pricing";
import type { BraceletJewelryProductView } from "@/lib/bracelet-jewelry-products";
import { displayPendantDescription } from "@/lib/workshop-pendant-utils";
import {
  WORKSHOP_PLATING_OPTIONS,
  WORKSHOP_RING_SIZES,
  RING_WORKSHOP_IMAGE_CLASS,
  RING_WORKSHOP_IMAGE_FRAME_CLASS,
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

function LuxuryDivider() {
  return (
    <div className="flex max-w-[220px] items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-stone-300" />
      <span className="text-[10px] text-stone-300" aria-hidden>
        ✦
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-stone-300 to-stone-300" />
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="max-w-xl">
      <h3 className="text-lg font-semibold tracking-tight text-luxury-ink sm:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-luxury-muted">{description}</p>
    </header>
  );
}

function SizeSamplesSection({
  sampleMap,
  ringPrices,
}: {
  sampleMap: Map<WorkshopRingSampleType, string>;
  ringPrices: WorkshopRingPriceView[];
}) {
  const sizes = WORKSHOP_RING_SIZES.filter(
    (sizeMm) => sampleMap.has(sizeToSampleType(sizeMm)) || getSizePriceInfo(ringPrices, sizeMm)
  );
  if (!sizes.length) return null;

  return (
    <section>
      <SectionHeader title="ขนาดหน้ากว้าง" description={t("workshop.ring_size_desc")} />
      <div className="mt-8 grid grid-cols-2 gap-5 sm:mt-10 sm:gap-8 xl:grid-cols-4">
        {sizes.map((sizeMm) => {
          const src = sampleMap.get(sizeToSampleType(sizeMm));
          const priceInfo = getSizePriceInfo(ringPrices, sizeMm);

          return (
            <figure key={sizeMm} className="group text-center">
              <div className={RING_WORKSHOP_IMAGE_FRAME_CLASS}>
                {src ? (
                  <img
                    src={src}
                    alt={`ขนาด ${sizeMm} มม.`}
                    className={RING_WORKSHOP_IMAGE_CLASS}
                  />
                ) : (
                  <span className="text-sm text-stone-400">ไม่มีรูป</span>
                )}
              </div>
              <figcaption className="mt-3 space-y-1 sm:mt-4 sm:space-y-1.5">
                <p className="text-sm font-medium tracking-tight text-luxury-ink sm:text-base">{sizeMm} มม.</p>
                {priceInfo?.price != null ? (
                  <>
                    <p className="text-sm text-luxury-ink">{formatPrice(priceInfo.price)}</p>
                    {priceInfo.priceNote && (
                      <p className="text-xs text-luxury-muted">{priceInfo.priceNote}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-luxury-muted">
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
}: {
  sampleMap: Map<WorkshopRingSampleType, string>;
}) {
  const platings = WORKSHOP_PLATING_OPTIONS.filter((plating) =>
    sampleMap.has(platingToSampleType(plating.value))
  );
  if (!platings.length) return null;

  return (
    <section className="border-t border-stone-200/80 pt-14">
      <SectionHeader title="ชุบสี" description={t("workshop.ring_plating_desc")} />
      <div className="mt-8 grid grid-cols-2 gap-5 sm:mt-10 sm:grid-cols-3 sm:gap-8">
        {platings.map((plating) => {
          const src = sampleMap.get(platingToSampleType(plating.value));
          return (
            <figure key={plating.value} className="group text-center">
              <div className={RING_WORKSHOP_IMAGE_FRAME_CLASS}>
                {src ? (
                  <img
                    src={src}
                    alt={plating.label}
                    className={RING_WORKSHOP_IMAGE_CLASS}
                  />
                ) : (
                  <span className="text-sm text-stone-400">ไม่มีรูป</span>
                )}
              </div>
              <figcaption className="mt-3 text-xs font-medium text-luxury-ink sm:mt-4 sm:text-sm">{plating.label}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function AddonSamplesSection({
  addons,
}: {
  addons: WorkshopAddonView[];
}) {
  if (!addons.length) return null;

  return (
    <section className="border-t border-stone-200/80 pt-14">
      <SectionHeader title="เลเซอร์และฝังพลอย" description={t("workshop.ring_addon_desc")} />
      <div className="mt-8 grid grid-cols-2 gap-5 sm:mt-10 sm:gap-8">
        {addons.map((addon) => (
          <figure key={addon.addonType} className="group text-center">
            <div className={RING_WORKSHOP_IMAGE_FRAME_CLASS}>
              {addon.imageUrl ? (
                <img
                  src={addon.imageUrl}
                  alt={addon.label}
                  className={RING_WORKSHOP_IMAGE_CLASS}
                />
              ) : (
                <span className="text-sm text-stone-400">ไม่มีรูป</span>
              )}
            </div>
            <figcaption className="mt-3 space-y-1 sm:mt-4 sm:space-y-1.5">
              <h4 className="text-xs font-medium text-luxury-ink sm:text-sm">{addon.label}</h4>
              {addon.price != null ? (
                <p className="text-sm text-luxury-ink">{formatPrice(addon.price)}</p>
              ) : (
                <p className="text-sm text-luxury-muted">
                  {addon.priceNote || t("workshop.price_inquire")}
                </p>
              )}
              {addon.priceNote && addon.price != null && (
                <p className="text-xs leading-relaxed text-luxury-muted">{addon.priceNote}</p>
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
    <figure className="group text-center">
      {imageUrl ? (
        <div className={`${getBraceletImageFrameClass("stone")} rounded-2xl bg-stone-50/80 transition group-hover:bg-stone-50`}>
          <img src={imageUrl} alt={label} className={getBraceletImageClass("stone")} />
        </div>
      ) : (
        <div className={`${getBraceletImageFrameClass("stone")} rounded-2xl bg-stone-50/80 text-sm text-stone-400`}>
          ไม่มีรูป
        </div>
      )}
      <figcaption className="mt-5 space-y-1">
        <p className="text-sm font-medium text-luxury-ink">{label}</p>
        <p className="text-sm text-luxury-muted">{formatPrice(price)}</p>
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
    <figure className="group flex flex-col items-center text-center">
      {imageUrl ? (
        <div className={`${getBraceletImageFrameClass("pendant")} rounded-2xl bg-stone-50/80 transition group-hover:bg-stone-50`}>
          <img src={imageUrl} alt={label} className={getBraceletImageClass("pendant")} />
        </div>
      ) : (
        <div className={`${getBraceletImageFrameClass("pendant")} rounded-2xl bg-stone-50/80 text-sm text-stone-400`}>
          ไม่มีรูป
        </div>
      )}
      <figcaption className="mt-5 max-w-xs space-y-1.5">
        <p className="text-sm font-medium text-luxury-ink">{label}</p>
        {description ? (
          <p className="text-sm leading-relaxed text-luxury-muted">{description}</p>
        ) : null}
        <p className="text-sm text-luxury-ink">
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
    <div className="border-t border-stone-200/80 pt-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-400">
          Stone Bracelet
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-luxury-ink">ตัวเลือกกำไลและจี้</h3>
        <LuxuryDivider />
        <p className="mt-4 text-sm leading-relaxed text-luxury-muted">
          เลือกหินและจี้เสริมตามที่ร้านเปิดให้บริการ
        </p>
      </header>

      <div className="space-y-16">
        {visibleStones.length > 0 ? (
          <section>
            <SectionHeader
              title="กำไลหิน"
              description={`เลือกหินแต่ละชนิด ราคา ${formatPrice(BRACELET_STONE_PRICE)}`}
            />
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
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

        <section className={visibleStones.length > 0 ? "border-t border-stone-200/80 pt-14" : undefined}>
          <SectionHeader
            title={pendantGroup?.title || "จี้"}
            description={pendantGroup?.description || "เลือกจี้เสริมสำหรับกำไล"}
          />
          {visiblePendants.length > 0 ? (
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
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
            <p className="mt-8 text-sm text-luxury-muted">ยังไม่มีรายการจี้</p>
          )}
        </section>
      </div>
    </div>
  );
}

function RingOptionsSection({
  workshop,
}: {
  workshop: WorkshopData;
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
    <div className="border-t border-stone-200/80 pt-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-400">Ring Workshop</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-luxury-ink">{t("workshop.ring_options_title")}</h3>
        <LuxuryDivider />
        <p className="mt-4 text-sm leading-relaxed text-luxury-muted">{t("workshop.ring_options_intro")}</p>
      </header>

      <div className="space-y-16">
        {hasSizes && (
          <SizeSamplesSection sampleMap={sampleMap} ringPrices={workshop.ringPrices} />
        )}
        {hasPlating && <PlatingSamplesSection sampleMap={sampleMap} />}
        {hasAddons && <AddonSamplesSection addons={workshop.addons} />}
      </div>
    </div>
  );
}

function WorkshopMetaSection({
  workshop,
}: {
  workshop: WorkshopData;
}) {
  const visibleSteps = workshop.classSteps.filter(
    (step) => !shouldHideMetaText(`${step.title} ${step.description}`)
  );
  const visibleReceivedItems = workshop.receivedItems.filter((item) => !shouldHideMetaText(item));
  const visibleBookingTerms = workshop.bookingTerms.filter((term) => !shouldHideMetaText(term));

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <article>
        <h3 className="text-lg font-semibold text-luxury-ink">{t("workshop.steps_title")}</h3>
        <div className="mt-8 space-y-0">
          {visibleSteps.map((step, index) => (
            <div key={step.title} className="relative flex gap-5 border-l border-stone-200 py-5 pl-6">
              <span className="absolute -left-[5px] top-6 h-2.5 w-2.5 rounded-full border-2 border-white bg-stone-300" />
              <span className="shrink-0 pt-0.5 text-[11px] font-medium tracking-[0.2em] text-stone-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-medium text-luxury-ink">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-luxury-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <div className="space-y-10">
        <article className="rounded-2xl bg-stone-50/60 p-6 sm:p-7">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-400">
            {t("workshop.received_title")}
          </h3>
          <ul className="mt-5 space-y-3.5">
            {visibleReceivedItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-luxury-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-stone-200/80 p-6 sm:p-7">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-400">
            {t("workshop.terms_title")}
          </h3>
          <ul className="mt-5 space-y-3.5">
            {visibleBookingTerms.map((term) => (
              <li key={term} className="flex items-start gap-3 text-sm leading-relaxed text-luxury-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
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
    <article className="group flex h-full flex-col items-center rounded-2xl bg-stone-50/50 px-4 py-6 text-center transition hover:bg-stone-50 sm:items-start sm:text-left">
      {option.imageUrl ? (
        <img
          src={option.imageUrl}
          alt={option.label}
          className="mb-4 max-h-36 w-auto object-contain"
        />
      ) : null}
      <h4 className="text-sm font-medium text-luxury-ink">{option.label}</h4>
      {option.description && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-luxury-muted">{option.description}</p>
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
    <section className="border-t border-stone-200/80 py-14">
      <div className="mb-10 max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-400">
          {group.groupType === "SIZE" && "Ring Size"}
          {group.groupType === "STYLE" && "Design"}
          {group.groupType === "PLATING" && "Plating"}
          {group.groupType === "ADDON" && "Add-on"}
          {group.groupType === "CUSTOM" && "Options"}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-luxury-ink">{group.title}</h3>
        {group.description && (
          <p className="mt-2 text-sm leading-relaxed text-luxury-muted">{group.description}</p>
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
  onBack,
}: {
  workshop: WorkshopData;
  braceletProducts: BraceletJewelryProductView[];
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
    <div className="space-y-14">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-luxury-muted transition hover:text-luxury-ink"
      >
        <span aria-hidden>←</span>
        กลับไปเลือกเวิร์คชอป
      </button>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <article className="space-y-8">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-400">
              {workshop.categoryName}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-luxury-ink sm:text-4xl">
              {workshop.title}
            </h2>
            <LuxuryDivider />
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-luxury-muted">{workshop.summary}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.facebook.com/mejaicrafts"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-stone-900 px-7 py-3 text-sm font-medium text-white no-underline transition hover:bg-stone-800"
            >
              {t("workshop.book_button")}
            </a>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-200/80 sm:grid-cols-2">
            {workshop.infoCards.map((card) => (
              <div key={card.label} className="bg-white px-5 py-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-stone-400">{card.label}</p>
                <p className="mt-2 text-sm text-luxury-ink">{card.value}</p>
              </div>
            ))}
          </div>
        </article>

        <figure className="lg:pt-2">
          <div className="overflow-hidden rounded-2xl bg-stone-100 shadow-[0_20px_50px_-24px_rgba(28,25,23,0.35)]">
            <div
              className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${featuredIndex * 100}%)` }}
            >
              {workshop.featuredImages.map((imagePath) => (
                <img
                  key={imagePath}
                  className="aspect-[4/5] w-full shrink-0 object-cover"
                  src={imagePath}
                  alt={workshop.featuredTitle}
                />
              ))}
            </div>
          </div>
          <figcaption className="mt-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-stone-400">
              {workshop.featuredSubtitle}
            </p>
            <p className="mt-1.5 text-base font-medium text-luxury-ink">{workshop.featuredTitle}</p>
          </figcaption>
        </figure>
      </div>

      <div className="border-t border-stone-200/80 pt-14">
        <WorkshopMetaSection workshop={workshop} />
      </div>

      {hasRingOptions ? (
        <RingOptionsSection workshop={workshop} />
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

function WorkshopHighlights() {
  const items = [
    { label: "เรียนรู้ทีละขั้นตอน", detail: "สอนโดยช่างมืออาชีพ" },
    { label: "เลือกวัสดุเอง", detail: "หิน สีชุบ และดีไซน์" },
    { label: "ได้ชิ้นงานกลับบ้าน", detail: "พกผลงานกลับไปในวันเดียว" },
  ];

  return (
    <div className="mb-8 grid gap-5 text-center sm:grid-cols-3 sm:gap-6 sm:text-left">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-sm font-medium text-luxury-ink">{item.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-luxury-muted">{item.detail}</p>
        </div>
      ))}
    </div>
  );
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
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 lg:px-10">
      <header className="mb-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-400">Workshop</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-luxury-ink sm:text-4xl">
          เลือกเวิร์คชอป
        </h1>
        <div className="mx-auto mt-3 flex max-w-[220px] items-center justify-center gap-3">
          <LuxuryDivider />
        </div>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-luxury-muted">
          เลือกคอร์สที่สนใจ แล้วกดดูรายละเอียดเพื่อดูขั้นตอน ราคา และตัวเลือกเพิ่มเติม
        </p>
        <p className="mt-2 text-xs tracking-wide text-stone-400">
          {workshops.length} คอร์สให้เลือก
        </p>
      </header>

      <WorkshopHighlights />

      <div className="space-y-12">
        {workshops.map(({ category, workshop }, index) => {
          const image = getWorkshopImage(workshop, fallbackImage);
          const takeHome = getInfoValue(workshop, ["ได้รับ", "take-home", "take home"]);
          const duration = getInfoValue(workshop, ["ระยะเวลา", "duration", "time"]);
          const isReversed = index % 2 === 1;

          return (
            <article key={workshop.id} className="group">
              <div className={`grid gap-5 lg:grid-cols-2 lg:gap-8 ${isReversed ? "lg:[&>*:first-child]:order-2" : ""}`}>
                {image ? (
                  <button
                    type="button"
                    onClick={() => onSelect(category.slug, workshop.slug)}
                    className="relative block w-full overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={workshop.title}
                      className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02] sm:aspect-[16/10]"
                    />
                  </button>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-stone-100 sm:aspect-[16/10]">
                    <span className="text-sm text-stone-400">ไม่มีรูป</span>
                  </div>
                )}

                <div className="flex flex-col justify-center lg:py-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-stone-400">
                    {category.name}
                  </p>
                  <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-luxury-ink sm:text-[1.75rem]">
                    {workshop.title}
                  </h2>
                  {workshop.summary ? (
                    <p className="mt-3 text-sm leading-6 text-luxury-muted">{workshop.summary}</p>
                  ) : null}

                  {(takeHome || duration) && (
                    <div className="mt-4 space-y-1 text-sm text-luxury-muted">
                      {duration ? (
                        <p className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                          {duration}
                        </p>
                      ) : null}
                      {takeHome ? (
                        <p className="flex items-center gap-2">
                          <Gem className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                          {takeHome}
                        </p>
                      ) : null}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelect(category.slug, workshop.slug)}
                    className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-luxury-ink transition hover:text-stone-500"
                  >
                    ดูรายละเอียดเวิร์คชอป
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>

              {index < workshops.length - 1 ? (
                <div className="mt-10 h-px bg-stone-200" />
              ) : null}
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
  const [bannerActiveIndex, setBannerActiveIndex] = useState(0);
  const [activeCategorySlug, setActiveCategorySlug] = useState(initialCatalog[0]?.slug ?? "");
  const [activeWorkshopSlug, setActiveWorkshopSlug] = useState(
    initialCatalog[0]?.workshops[0]?.slug ?? ""
  );
  const [viewMode, setViewMode] = useState<"overview" | "detail">("overview");

  const catalog = initialCatalog;
  const braceletProducts = initialBraceletProducts;

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
      <section className="bg-white pb-4">
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
    <section className="bg-white pb-20">
      <div className="mx-auto max-w-6xl space-y-14 px-5 pt-8 sm:px-8 lg:px-10">
        <WorkshopDetail
          workshop={activeWorkshop}
          braceletProducts={braceletProducts}
          onBack={() => {
            setViewMode("overview");
            window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
          }}
        />
      </div>
    </section>
  );
}
