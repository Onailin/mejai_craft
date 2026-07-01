export const WORKSHOP_RING_SIZES = [2, 3, 4, 5] as const;

export const WORKSHOP_RING_STYLES = [
  { value: "CLASSIC", label: "Classic" },
  { value: "TEXTURE", label: "Texture" },
] as const;

export const WORKSHOP_PLATING_OPTIONS = [
  { value: "WHITE_GOLD", label: "ทองคำขาว" },
  { value: "GOLD", label: "ทอง" },
  { value: "ROSE_GOLD", label: "โรสโกลด์" },
] as const;

export const WORKSHOP_ADDON_OPTIONS = [
  { value: "LASER", label: "เลเซอร์", defaultLabel: "เลเซอร์" },
  { value: "STONE_SETTING", label: "ฝังพลอย", defaultLabel: "ฝังพลอย" },
] as const;

export type WorkshopRingStyleValue = (typeof WORKSHOP_RING_STYLES)[number]["value"];
export type WorkshopPlatingValue = (typeof WORKSHOP_PLATING_OPTIONS)[number]["value"];
export type WorkshopAddonValue = (typeof WORKSHOP_ADDON_OPTIONS)[number]["value"];

export type WorkshopRingPriceCell = {
  style: WorkshopRingStyleValue;
  sizeMm: number;
  plating: WorkshopPlatingValue;
  price: number | null;
  priceNote: string;
};

export type WorkshopAddonCell = {
  addonType: WorkshopAddonValue;
  label: string;
  price: number | null;
  priceNote: string;
};

export function buildRingPriceFieldName(
  style: WorkshopRingStyleValue,
  sizeMm: number,
  plating: WorkshopPlatingValue
) {
  return `ring_price_${style}_${sizeMm}_${plating}`;
}

export function buildRingNoteFieldName(
  style: WorkshopRingStyleValue,
  sizeMm: number,
  plating: WorkshopPlatingValue
) {
  return `ring_note_${style}_${sizeMm}_${plating}`;
}

export function buildAddonPriceFieldName(addonType: WorkshopAddonValue) {
  return `addon_price_${addonType}`;
}

export function buildAddonNoteFieldName(addonType: WorkshopAddonValue) {
  return `addon_note_${addonType}`;
}

export type WorkshopRingSampleType =
  | "STYLE_CLASSIC"
  | "STYLE_TEXTURE"
  | "PLATING_WHITE_GOLD"
  | "PLATING_GOLD"
  | "PLATING_ROSE_GOLD"
  | "SIZE_2MM"
  | "SIZE_3MM"
  | "SIZE_4MM"
  | "SIZE_5MM";

export const WORKSHOP_RING_REFERENCE_GROUPS = [
  {
    title: "ขนาดหน้ากว้าง",
    description: "ตัวอย่างขนาด 2–5 มม.",
    items: WORKSHOP_RING_SIZES.map((sizeMm) => ({
      sampleType: `SIZE_${sizeMm}MM` as WorkshopRingSampleType,
      label: `${sizeMm} มม.`,
    })),
  },
  {
    title: "ชุบสี",
    description: "ทองคำขาว · ทอง · โรสโกลด์",
    items: WORKSHOP_PLATING_OPTIONS.map((plating) => ({
      sampleType: `PLATING_${plating.value}` as WorkshopRingSampleType,
      label: plating.label,
    })),
  },
] as const;

/** @deprecated use WORKSHOP_RING_REFERENCE_GROUPS — kept for admin backward compat */
export const WORKSHOP_RING_SAMPLE_GROUPS = WORKSHOP_RING_REFERENCE_GROUPS;

export const WORKSHOP_RING_SAMPLE_TYPES: WorkshopRingSampleType[] =
  WORKSHOP_RING_REFERENCE_GROUPS.flatMap((group) =>
    group.items.map((item) => item.sampleType)
  );

export function styleToSampleType(style: WorkshopRingStyleValue): WorkshopRingSampleType {
  return `STYLE_${style}` as WorkshopRingSampleType;
}

export function platingToSampleType(plating: WorkshopPlatingValue): WorkshopRingSampleType {
  return `PLATING_${plating}` as WorkshopRingSampleType;
}

export function sizeToSampleType(sizeMm: number): WorkshopRingSampleType {
  return `SIZE_${sizeMm}MM` as WorkshopRingSampleType;
}
export function buildAddonLabelFieldName(addonType: WorkshopAddonValue) {
  return `addon_label_${addonType}`;
}

export function buildSampleFileFieldName(sampleType: WorkshopRingSampleType) {
  return `sample_file_${sampleType}`;
}

export function buildSampleUrlFieldName(sampleType: WorkshopRingSampleType) {
  return `sample_url_${sampleType}`;
}

export function buildAddonImageFileFieldName(addonType: WorkshopAddonValue) {
  return `addon_file_${addonType}`;
}

export function buildAddonImageUrlFieldName(addonType: WorkshopAddonValue) {
  return `addon_url_${addonType}`;
}

export function parseOptionalPrice(raw: FormDataEntryValue | null): number | null {
  if (raw === null || raw === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.floor(value);
}

export function isRingWorkshop(slug: string, categorySlug?: string | null) {
  return slug === "silver-ring" || categorySlug === "silver-ring";
}

/** กรอบรูปแหวนบนหน้าเวิร์คชอป — ขนาดเท่ากันทุกรายการ (มือถือ 2 คอลัมน์) */
export const RING_WORKSHOP_IMAGE_FRAME_CLASS =
  "mx-auto flex aspect-square w-full items-center justify-center rounded-2xl bg-stone-50/80 p-3 transition group-hover:bg-stone-50 sm:p-4";

export const RING_WORKSHOP_IMAGE_CLASS = "h-full w-full object-contain";

/** @deprecated ใช้ RING_WORKSHOP_IMAGE_* แทน */
export const RING_SAMPLE_IMAGE_CLASS = RING_WORKSHOP_IMAGE_CLASS;

/** @deprecated ใช้ RING_WORKSHOP_IMAGE_* แทน */
export const RING_PLATING_SAMPLE_IMAGE_CLASS = RING_WORKSHOP_IMAGE_CLASS;
