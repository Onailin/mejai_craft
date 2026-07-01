import type { PageContent } from "@/types";

/** รูปสไลด์เริ่มต้นหน้า /workshop */
export const DEFAULT_WORKSHOP_PAGE_BANNERS = [
  "/images/banner/banner.jpg",
  "/images/banner/banner5.jpg",
  "/images/banner/banner7.jpg",
  "/images/banner/banner8.jpg",
  "/images/banner/banner14.jpg",
  "/images/banner/banner19.jpg",
  "/images/banner/banner20.jpg",
] as const;

export const pages: PageContent[] = [
  {
    id: "home",
    navLabel: "Home",
    title: "Mejai Crafts",
    eyebrow: "Minimal Jewelry Atelier",
    description:
      'ยินดีต้อนรับสู่ "มีใจ คราฟต์" ร้านเครื่องประดับและอัญมณีแห่งชุมชนริมน้ำจันทบูร จันทบุรี พร้อมทั้งเวิร์คช็อป ที่เปิดโอกาสให้ทุกคนได้เรียนรู้และสร้างสรรค์ชิ้นงานด้วยตัวเอง',
    cards: [
      {
        title: "งานคราฟต์ที่เลือกได้ตามสไตล์",
        subtitle: "Gemstone & Jewelry",
        description:
          "เลือกชมอัญมณีและจิวเวลรี่ในหมวดที่ชัดเจน พร้อมภาพและคำอธิบายอ่านง่าย",
        image: "/images/banner/home.jpg",
        accent: "Mejai Crafts",
      },
    ],
  },
  {
    id: "about",
    navLabel: "เกี่ยวกับเรา",
    title: "About Mejai Crafts",
    eyebrow: "Our Story",
    description: "เรื่องราวของร้านและข้อมูลสำหรับติดต่อเรา",
    cards: [
      {
        title: "Family Legacy",
        subtitle: "Gem City Heritage",
        description: "เรื่องราวงานครอบครัวจากเมืองแห่งอัญมณี",
        image: "",
        accent: "About",
      },
    ],
  },
  {
    id: "contact",
    navLabel: "ติดต่อ",
    title: "Contact Us",
    eyebrow: "Get in Touch",
    description: "ช่องทางติดต่อและที่ตั้งร้าน",
    cards: [
      {
        title: "Contact Mejai Crafts",
        subtitle: "Studio Contact",
        description: "รายละเอียดการติดต่อ Mejai Crafts",
        image: "/images/banner/shop1.jpg",
        accent: "Contact",
      },
    ],
  },
  {
    id: "jewelry",
    navLabel: "สินค้า",
    title: "สินค้า",
    eyebrow: "Curated Details",
    description: "รวมเครื่องประดับ และชิ้นงานที่สามารถสั่งทำได้",
    cards: [],
  },
  {
    id: "workshop",
    navLabel: "เวิร์คชอป",
    title: "Jewelry Workshop",
    eyebrow: "Hands-on Experience",
    description:
      "ข้อมูลเวิร์คชอปสำหรับลูกค้าที่อยากออกแบบ เลือกวัสดุ และเรียนรู้ขั้นตอนทำชิ้นงานของตัวเอง",
    cards: DEFAULT_WORKSHOP_PAGE_BANNERS.map((image, index) => ({
      title: "Workshop at Mejai Crafts",
      subtitle: "Hands-on Experience",
      description: "เลือกเวิร์คชอปและดูรายละเอียดก่อนจอง",
      image,
      accent: index === 0 ? "Workshop" : `Workshop ${index + 1}`,
    })),
  },
];

export function getPage(id: string): PageContent {
  return pages.find((p) => p.id === id) ?? pages[0];
}
