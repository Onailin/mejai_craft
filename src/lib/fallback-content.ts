import type { BirthstoneView, GemView, JewelryCategoryView, LuckyStoneView, WorkshopCatalogView, WorkshopView } from "@/types";

/** Empty fallbacks — content images are served from cloud storage via the database. */
export const fallbackGems: GemView[] = [];
export const fallbackLuckyStones: LuckyStoneView[] = [];
export const fallbackBirthstones: BirthstoneView[] = [];
export const fallbackJewelryCategories: JewelryCategoryView[] = [];

export const fallbackWorkshopCatalog: WorkshopCatalogView[] = [];

export const fallbackWorkshop: WorkshopView = {
  id: "fb-workshop",
  slug: "silver-ring",
  categorySlug: "silver-ring",
  categoryName: "แหวนเงิน",
  title: "Workshop แหวนเงิน",
  summary: "ราคาตามขนาดหน้ากว้างแหวนต่อท่าน",
  featuredTitle: "ตัวอย่างแหวนเงิน",
  featuredSubtitle: "Silver Ring Workshop",
  bannerImages: [],
  featuredImages: [],
  infoCards: [
    { label: "ระยะเวลา", value: "ประมาณ 45 นาที - 1 ชั่วโมง" },
    { label: "ได้รับผลงาน", value: "นำแหวนกลับบ้านได้เลย" },
    { label: "ราคา 2 มม.", value: "1,499 บาท/ท่าน" },
    { label: "ราคา 3 มม.", value: "1,699 บาท/ท่าน" },
    { label: "ราคา 4 มม.", value: "1,899 บาท/ท่าน" },
  ],
  classSteps: [
    { title: "เลือกขนาด", description: "เลือกขนาดหน้ากว้างแหวนตามงบประมาณและสไตล์ที่ต้องการ" },
    { title: "เลือกวัสดุ", description: "เลือกขนาดหน้ากว้างแหวนมาตรฐาน 2, 3 หรือ 4 มม." },
    { title: "ลงมือทำ", description: "ขึ้นรูปและตกแต่งแหวนเงินด้วยขั้นตอนเวิร์คชอปแบบ hands-on" },
    { title: "รับผลงาน", description: "รับแหวนเงินที่ทำเสร็จกลับบ้านได้ภายในคลาส" },
  ],
  receivedItems: [
    "เลือกขนาดหน้ากว้างแหวนได้ตามรายการราคา",
    "ขนาดหน้ากว้างมาตรฐาน 2, 3 และ 4 มม.",
    "ได้รับแหวนเงินที่ทำเสร็จกลับบ้าน",
  ],
  bookingTerms: [
    "หากต้องการหน้ากว้างพิเศษ 5 มม. กรุณาแจ้งแอดมินล่วงหน้าเท่านั้น",
    "ขนาด 5 มม. มีค่าใช้จ่ายเพิ่มเติม",
    "ราคาเวิร์คชอปคิดตามขนาดหน้ากว้างแหวนต่อท่าน",
  ],
  optionGroups: [],
  ringPrices: [],
  ringSampleImages: [],
  addons: [],
};
