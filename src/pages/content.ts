import type { PageContent, PageKey } from "./types";

export const pages: PageContent[] = [
  {
    id: "home",
    navLabel: "Home",
    title: "Mejai Crafts",
    eyebrow: "Minimal Jewelry Atelier",
    description:
      "พื้นที่แนะนำอัญมณี เครื่องประดับ และเวิร์คชอปในบรรยากาศเรียบ สะอาด และหรูแบบพอดี",
    cards: [
      {
        title: "งานคราฟต์ที่เลือกได้ตามสไตล์",
        subtitle: "Gemstone & Jewelry",
        description:
          "เลือกชมอัญมณีและจิวเวลรี่ในหมวดที่ชัดเจน พร้อมภาพและคำอธิบายอ่านง่าย",
        image: "/images/banner/home.jpg",
        accent: "Mejai Crafts",
      },
      {
        title: "สำรวจอัญมณี",
        subtitle: "Gemstone Guide",
        description:
          "อ่านข้อมูลโทนสี ความหมาย และไอเดียการเลือกใช้พลอยให้เข้ากับชิ้นงาน",
        image:
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
        accent: "Guide",
      },
      {
        title: "เวิร์คชอปส่วนตัว",
        subtitle: "Workshop",
        description:
          "เรียนรู้การออกแบบ เลือกวัสดุ และทำความเข้าใจขั้นตอนงานจิวเวลรี่แบบใกล้ชิด",
        image:
          "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
        accent: "Workshop",
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
        image: "/images/banner/banner.jpg",
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
        image: "/images/banner/banner4.jpg",
        accent: "Contact",
      },
    ],
  },
  {
    id: "jewelry",
    navLabel: "จิวเวลรี่",
    title: "Fine Jewelry Pieces",
    eyebrow: "Curated Details",
    description:
      "รวมเครื่องประดับ และชิ้นงานที่สามารถสั่งทำได้",
    cards: [
      {
        title: "เซ็ตสร้อยและจี้",
        subtitle: "Pendant Set",
        description: "เหมาะเป็นของขวัญหรือชิ้นประจำวัน โทนภาพรวมดูแพงและใส่ได้บ่อย",
        image:
          "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
        accent: "Gift ready",
      },
      {
        title: "กำไลเลเยอร์",
        subtitle: "Layer Bracelet",
        description: "ออกแบบให้ซ้อนกับนาฬิกาหรือกำไลเส้นอื่นได้อย่างสมส่วน",
        image:
          "https://images.unsplash.com/photo-1511253819057-5408d4d70465?auto=format&fit=crop&w=900&q=80",
        accent: "Layered look",
      },
    ],
  },
  {
    id: "workshop",
    navLabel: "เวิร์คชอป",
    title: "Jewelry Workshop",
    eyebrow: "Hands-on Experience",
    description:
      "ข้อมูลเวิร์คชอปสำหรับลูกค้าที่อยากออกแบบ เลือกวัสดุ และเรียนรู้ขั้นตอนทำชิ้นงานของตัวเอง",
    cards: [
      {
        title: "ออกแบบชิ้นงาน",
        subtitle: "Design Session",
        description: "เริ่มจาก mood, โทนสี และรูปแบบที่อยากได้ เพื่อวางดีไซน์ให้เข้ากับผู้ใส่",
        image: "/images/workshop/workshop2.jpg",
        accent: "Custom idea",
      },
      {
        title: "เลือกพลอยและวัสดุ",
        subtitle: "Material Selection",
        description: "เรียนรู้ความต่างของพลอย สี ตัวเรือน และผิวงานก่อนเริ่มทำจริง",
        image: "/images/workshop/workshop3.jpg",
        accent: "Material table",
      },
      {
        title: "ทำชิ้นงานด้วยมือ",
        subtitle: "Craft Moment",
        description: "ได้สัมผัสขั้นตอนพื้นฐานของงานจิวเวลรี่ พร้อมคำแนะนำจากทีมงาน",
        image: "/images/banner/banner1.jpg",
        accent: "Workshop day",
      },
      {
        title: "บรรยากาศเวิร์คชอป 1",
        subtitle: "Workshop Gallery",
        description: "ภาพบรรยากาศเวิร์คช็อปจริงจาก Mejai Crafts",
        image: "/images/banner/banner5.jpg",
        accent: "Workshop gallery",
      },
      {
        title: "บรรยากาศเวิร์คชอป 2",
        subtitle: "Workshop Gallery",
        description: "ภาพบรรยากาศเวิร์คช็อปจริงจาก Mejai Crafts",
        image: "/images/banner/banner7.jpg",
        accent: "Workshop gallery",
      },
      {
        title: "บรรยากาศเวิร์คชอป 3",
        subtitle: "Workshop Gallery",
        description: "ภาพบรรยากาศเวิร์คช็อปจริงจาก Mejai Crafts",
        image: "/images/banner/banner8.jpg",
        accent: "Workshop gallery",
      },
      {
        title: "บรรยากาศเวิร์คชอป 4",
        subtitle: "Workshop Gallery",
        description: "ภาพบรรยากาศเวิร์คช็อปจริงจาก Mejai Crafts",
        image: "/images/banner/banner14.jpg",
        accent: "Workshop gallery",
      },
    ],
  },
];

export const defaultPageId = pages[0].id;

export function getPagePath(pageId: PageKey): string {
  return pageId === "home" ? "/" : `/${pageId}`;
}

export function getCurrentPage(): PageKey {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const pathId = normalizedPath === "/" ? "home" : normalizedPath.slice(1);

  if (pages.some((page) => page.id === pathId)) {
    return pathId as PageKey;
  }

  // Backward compatibility: support old hash links.
  const hashId = window.location.hash.replace("#", "");
  if (pages.some((page) => page.id === hashId)) {
    return hashId as PageKey;
  }

  return defaultPageId;
}
