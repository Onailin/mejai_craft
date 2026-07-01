type CopyVars = Record<string, string | number>;

function getCopyValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/** ข้อความ UI ภาษาไทย — แทน i18n client bundle */
const siteCopy = {
  nav_home: "หน้าหลัก",
  nav_about: "เกี่ยวกับเรา",
  nav_contact: "ติดต่อ",
  nav_jewelry: "สินค้า",
  nav_workshop: "เวิร์คชอป",
  nav_birthstones: "พลอยประจำวัน",
  nav_login: "เข้าสู่ระบบ",
  nav_admin: "แอดมิน",
  app: {
    brand_name: "Mejai Crafts",
    brand_tagline: "Jewelry Design and Exhibition",
    footer: "© Mejai Crafts · Luxury gemstone and jewelry information",
  },
  home_banner: {
    cta_collection: "ชมคอลเลกชัน",
    cta_workshop: "ข้อมูลเวิร์คชอป",
  },
  page_hero: {
    cta_workshop: "ดูข้อมูลเวิร์คชอป",
    cta_jewelry: "ชมสินค้า",
  },
  home: {
    brand_title: "มีใจ คราฟต์",
    brand_desc:
      "งานคราฟต์อัญมณีที่ใส่ใจทุกรายละเอียด ผสานความงามตามธรรมชาติกับดีไซน์ร่วมสมัยที่เหนือกาลเวลา",
    tag_1: "Art",
    tag_2: "Design",
    tag_3: "Exhibition",
    interactive_label: "Interactive Lab",
    interactive_title: "สเกลความแข็งของอัญมณี",
    hard_gem_title: "พลอยเนื้อแข็ง",
    hard_gem_desc: "7.5-10 Mohs มีราคาสูง และนิยมใช้ทำเครื่องประดับ",
    hard_gem_examples: "เพชร · ทับทิม · ไพลิน · มรกต",
    soft_gem_title: "พลอยเนื้ออ่อน",
    soft_gem_desc:
      "อัญมณีอื่นๆ ทุกชนิดนอกเหนือจากพลอยเนื้อแข็ง ซึ่งมีความหลากหลายอย่างมหาศาลทั้งในด้านสีสัน และโครงร้าง",
    soft_gem_examples: "โอปอล · เทอร์ควอยซ์ · มูนสโตน · อเมทิสต์ · อความารีน · ทัวร์มาลีน",
    origin: "Origin",
    color: "Color",
    no_gem_title: "No gemstones active at {{hardness}} Mohs",
    no_gem_desc:
      "ระดับความแข็งนี้ส่วนใหญ่เป็นแร่ทั่วไป กรุณาเลื่อนสไลด์ไปที่ระดับ 7 - 10 เพื่อดูอัญมณีมีค่า",
    collection_label: "คอลเลกชัน",
    collection_title: "อัญมณี",
    lucky_label: "Beliefs & Meanings",
    lucky_title: "หินนำโชค",
  },
  birthstones: {
    eyebrow: "Daily Stones",
    title: "พลอยประจำวันเกิด",
    intro:
      "พลอยที่เชื่อมโยงกับวันเกิดของคุณ — เลือกชมอัญมณีประจำแต่ละวัน พร้อมความหมายและรายละเอียดที่ช่วยให้เลือกเครื่องประดับได้ตรงใจ",
    day_label: "วัน",
    color: "สี",
    origin: "แหล่งที่มา",
    hardness: "ความแข็ง",
    empty_title: "ยังไม่มีข้อมูลพลอยประจำวัน",
    empty_desc: "อัปโหลดรูปจากหน้าแอดมินก่อนจึงจะแสดงบนหน้าเว็บ",
  },
  about: {
    title: "เกี่ยวกับเรา",
    intro:
      "จากรุ่นสู่รุ่น เสน่ห์ของงานฝีมือและคุณค่าของอัญมณี\nทุกชิ้นงานจึงไม่ใช่เพียงเครื่องประดับ แต่เป็นเรื่องราวและความทรงจำจากเมืองแห่งอัญมณี จันทบุรี",
    business_card: "Business Card",
    contact_title: "ติดต่อที่",
    tagline: "เครื่องประดับ & อัญมณีคัดพิเศษ",
    facebook_label: "MEJAI Crafts - มีใจ คราฟต์",
    line_label: "สอบถาม / สั่งซื้อทาง LINE",
    studio_location: "ที่ตั้งสตูดิโอ",
    address_detail: "85 87 ถนน สุขาภิบาล ตำบลวัดใหม่ อำเภอเมืองจันทบุรี จันทบุรี 22000",
    get_directions: "เส้นทาง",
    photo_caption: "มีใจ คราฟต์ จิวเวลรี่ · จันทบุรี",
  },
  jewelry: {
    dropdown_label: "หมวดสินค้า",
    ring_collection_heading: "แหวนเงินทั้งหมด",
    ring_title: "แหวนเงิน",
    buy_button: "สั่งซื้อ",
    items_count: "{{count}} รายการ",
    prev_image_aria: "รูปก่อนหน้า",
    next_image_aria: "รูปถัดไป",
    preview_image_aria: "ดูรูปสินค้า {{index}}",
    prev_banner_aria: "แบนเนอร์ก่อนหน้า",
    next_banner_aria: "แบนเนอร์ถัดไป",
    go_banner_aria: "ไปที่แบนเนอร์ {{index}}",
    tab: {
      ring: "แหวน",
      "souvenir-pen": "ปากกาที่ระลึก",
    },
  },
  workshop: {
    label: "Workshop",
    categories_label: "หมวดเวิร์คชอป",
    book_button: "จองเวิร์คชอป",
    banner_slide_aria: "ไปยังสไลด์ {{index}}",
    featured_slide_aria: "ไปยังรูปเวิร์คชอป {{index}}",
    info_title: "Workshop แหวนเงิน",
    info_summary: "ราคาตามขนาดหน้ากว้างแหวนต่อท่าน",
    featured_subtitle: "Silver Ring Workshop",
    featured_title: "ตัวอย่างแหวนเงิน",
    steps_title: "ขั้นตอนในคลาส",
    received_title: "สิ่งที่ได้รับ",
    terms_title: "เงื่อนไขการจอง",
    ring_options_title: "ตัวเลือกแหวนเงิน",
    ring_options_intro:
      "เลือกขนาดหน้ากว้างและบริการเสริมได้ตามต้องการ ราคาหลักคิดตามขนาดต่อท่าน ภายในเวลาประมาณ 45 นาที–1 ชั่วโมง",
    ring_size_desc:
      "ราคาเวิร์คชอปคิดตามขนาดหน้ากว้างแหวนต่อท่าน ขนาด 5 มม. กรุณาแจ้งแอดมินล่วงหน้าและอาจมีค่าใช้จ่ายเพิ่มเติม",
    ring_plating_desc:
      "เลือกโทนสีชุบเพิ่มเติมได้ บริการชุบสีอาจมีค่าใช้จ่ายเพิ่มเติมตามแบบที่เลือก",
    ring_addon_desc: "บริการเสริมหลังทำแหวน หรือสั่งเพิ่มตามต้องการ",
    price_inquire: "สอบถามราคา",
  },
} as const;

export function t(key: string, vars?: CopyVars): string {
  const value = getCopyValue(siteCopy, key);
  if (typeof value !== "string") return key;
  if (!vars) return value;
  return Object.entries(vars).reduce(
    (text, [name, val]) => text.replaceAll(`{{${name}}}`, String(val)),
    value,
  );
}

export { siteCopy };
