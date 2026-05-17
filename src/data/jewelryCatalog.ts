import type { ProductCard } from "../pages/types";

export type JewelryCategoryKey =
  | "ring"
  | "earring"
  | "bracelet"
  | "necklace"
  | "pendant"
  | "perfume"
  | "souvenir-pen";

export const jewelryCategoryTabs: Array<{ id: JewelryCategoryKey; label: string }> = [
  { id: "ring", label: "แหวน" },
  { id: "earring", label: "ต่างหู" },
  { id: "bracelet", label: "กำไล" },
  { id: "necklace", label: "สร้อยคอ" },
  { id: "pendant", label: "จี้" },
  { id: "perfume", label: "น้ำหอม" },
  { id: "souvenir-pen", label: "ปากกาที่ระลึก" },
];

export const jewelryCatalog: Record<JewelryCategoryKey, ProductCard[]> = {
  ring: [
    {
      title: "แหวนพลอยกลาง",
      subtitle: "Statement Ring",
      description: "ชูพลอยเม็ดหลักด้วยตัวเรือนเรียบ ทำให้ชิ้นงานดูหรูโดยไม่รกสายตา",
      image:
        "/images/Jewelry/ring/ring1.jpg",
      accent: "Center stone",
    },
    {
      title: "แหวนมินิมอล",
      subtitle: "Classic Ring",
      description: "ดีไซน์เรียบ ใส่ได้ทุกวัน เหมาะกับทุกลุค",
      image: "/images/Jewelry/ring/ring2.jpg",
      accent: "Daily wear",
    },
    {
      title: "แหวน",
      subtitle: "Vintage Ruby Ring",
      description: "ดีไซน์คลาสสิก โทนอบอุ่น ใส่ออกงานได้",
      image: "/images/Jewelry/ring/ring3.jpg",
      accent: "Vintage look",
    },
  ],
  earring: [
    {
      title: "ต่างหูโทนเงิน",
      subtitle: "Silver Earrings",
      description: "รายละเอียดเรียบหรู โมเดิร์น",
      image:
        "/public",
      accent: "Light shine",
    },
  ],
  bracelet: [
    {
      title: "กำไลเลเยอร์",
      subtitle: "Layer Bracelet",
      description: "ออกแบบให้ซ้อนกับนาฬิกาหรือกำไลเส้นอื่นได้อย่างสมส่วน",
      image:
        "https://images.unsplash.com/photo-1511253819057-5408d4d70465?auto=format&fit=crop&w=900&q=80",
      accent: "Layered look",
    },
  ],
  necklace: [
    {
      title: "สร้อยคอเส้นบาง",
      subtitle: "Fine Necklace",
      description: "แมตช์ง่าย น้ำหนักเบา หรูแบบ understated",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      accent: "Layer ready",
    },
  ],
  pendant: [
    {
      title: "เซ็ตสร้อยและจี้",
      subtitle: "Pendant Set",
      description: "เหมาะเป็นของขวัญหรือชิ้นประจำวัน โทนภาพรวมดูแพงและใส่ได้บ่อย",
      image:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
      accent: "Gift ready",
    },
  ],
  perfume: [
    {
      title: "น้ำหอมคอลเลกชัน",
      subtitle: "Signature Scent",
      description: "กลิ่นพรีเมียม เสริมลุคจิวเวลรี่",
      image:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
      accent: "Premium scent",
    },
  ],
  "souvenir-pen": [
    {
      title: "ปากกาที่ระลึก",
      subtitle: "Souvenir Pen",
      description: "ของขวัญพรีเมียม เหมาะสำหรับโอกาสพิเศษ",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
      accent: "Gift item",
    },
  ],
};
