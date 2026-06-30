export const BIRTHSTONE_DAY_OPTIONS = [
  "วันอาทิตย์",
  "วันจันทร์",
  "วันอังคาร",
  "พุธกลางวัน",
  "พุธกลางคืน",
  "วันพฤหัสบดี",
  "วันศุกร์",
  "วันเสาร์",
] as const;

export type BirthstoneDay = (typeof BIRTHSTONE_DAY_OPTIONS)[number];

export function birthstoneDaySortOrder(day: string) {
  const index = BIRTHSTONE_DAY_OPTIONS.indexOf(day as BirthstoneDay);
  return index === -1 ? BIRTHSTONE_DAY_OPTIONS.length : index;
}

export function isBirthstoneDay(day: string): day is BirthstoneDay {
  return BIRTHSTONE_DAY_OPTIONS.includes(day as BirthstoneDay);
}
