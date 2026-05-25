import type { ProductCard } from "../pages/types";

export type JewelryCategoryKey =
  | "ring"
  | "souvenir-pen";

export const jewelryCategoryTabs: Array<{ id: JewelryCategoryKey; label: string }> = [
  { id: "ring", label: "แหวน" },
  { id: "souvenir-pen", label: "ปากกาที่ระลึก" },
];

export const jewelryCatalog: Record<JewelryCategoryKey, ProductCard[]> = {
  ring: [
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv1.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv2.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv3.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv4.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv5.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv6.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv7.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv8.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv9.jpg",
      accent: "925 silver",
    },
    {
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      image: "/images/Jewelry/ring/silv10.jpg",
      accent: "925 silver",
    },
  ],
  "souvenir-pen": [
    {
      title: "ปากกาที่ระลึก",
      subtitle: "Souvenir Pen",
      description: "ของขวัญพรีเมียม เหมาะสำหรับโอกาสพิเศษ",
      image: "/images/Jewelry/pen/pen1.jpg",
      accent: "Gift item",
    },
    {
      title: "ปากกาที่ระลึก",
      subtitle: "Souvenir Pen",
      description: "ดีไซน์พรีเมียม เหมาะสำหรับเป็นของขวัญหรือของสะสม",
      image: "/images/Jewelry/pen/prn2.jpg",
      accent: "Collector piece",
    },
    {
      title: "ปากกาที่ระลึก",
      subtitle: "Souvenir Pen",
      description: "ลุคเรียบหรู ใช้งานได้จริงในทุกวัน",
      image: "/images/Jewelry/pen/pen3.jpg",
      accent: "Daily premium",
    },
  ],
};
