export const BRACELET_STONE_PRICE = 444;

export const WORKSHOP_BRACELET_STONES = [
  { key: "amethyst", label: "อเมทิสต์" },
  { key: "rose_quartz", label: "โรสควอตซ์" },
  { key: "emerald", label: "มรกต" },
  { key: "garnet", label: "โกเมน" },
  { key: "citrine", label: "ซิทริน" },
  { key: "moonstone", label: "มูนสโตน" },
  { key: "aquamarine", label: "อความารีน" },
  { key: "opal", label: "โอปอล" },
] as const;

export const WORKSHOP_BRACELET_PENDANTS = [
  { key: "laser", label: "เลเซอร์", price: 666 },
  { key: "stone_laser", label: "ฝังพลอย + เลเซอร์", price: 999 },
] as const;

export type BraceletStoneKey = (typeof WORKSHOP_BRACELET_STONES)[number]["key"];
export type BraceletPendantKey = (typeof WORKSHOP_BRACELET_PENDANTS)[number]["key"];

export function braceletStoneDescription(key: BraceletStoneKey) {
  return `STONE:${key}`;
}

export function braceletPendantDescription(key: BraceletPendantKey) {
  return `PENDANT:${key}`;
}

export function isBraceletWorkshop(slug: string, categorySlug?: string | null) {
  return slug === "stone-bracelet" || categorySlug === "stone-bracelet";
}

/** กรอบรูปมาตรฐานกำไลหิน — ใช้ร่วมกัน admin และหน้าเว็บ */
export const BRACELET_STONE_IMAGE_FRAME_CLASS =
  "mx-auto flex h-40 w-[180px] items-center justify-center overflow-hidden bg-stone-50";

export const BRACELET_STONE_IMAGE_CLASS = "max-h-full max-w-full object-contain";

/** กรอบรูปมาตรฐานจี้ */
export const BRACELET_PENDANT_IMAGE_FRAME_CLASS =
  "mx-auto flex h-52 w-full max-w-xs items-center justify-center overflow-hidden bg-stone-50 sm:h-60";

export const BRACELET_PENDANT_IMAGE_CLASS = "max-h-full max-w-full object-contain";

export type BraceletImageVariant = "stone" | "pendant";

export function getBraceletImageFrameClass(variant: BraceletImageVariant) {
  return variant === "stone" ? BRACELET_STONE_IMAGE_FRAME_CLASS : BRACELET_PENDANT_IMAGE_FRAME_CLASS;
}

export function getBraceletImageClass(variant: BraceletImageVariant) {
  return variant === "stone" ? BRACELET_STONE_IMAGE_CLASS : BRACELET_PENDANT_IMAGE_CLASS;
}
