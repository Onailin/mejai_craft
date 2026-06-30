import { PrismaClient, DisplayMode, WorkshopListType, WorkshopOptionGroupType, Role, WorkshopRingStyle, WorkshopPlatingType, WorkshopAddonType, WorkshopRingSampleType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, role: Role.ADMIN, isActive: true },
      create: {
        email: adminEmail,
        name: "Admin",
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log("Admin user seeded");
  }

  const siteSettings = [
    { key: "phone", value: "0888491111" },
    { key: "maps_url", value: "https://maps.google.com" },
    { key: "facebook_url", value: "https://www.facebook.com/mejaicrafts" },
    {
      key: "address",
      value: "85 87 ถนน สุขาภิบาล ตำบลวัดใหม่ อำเภอเมืองจันทบุรี จันทบุรี 22000",
    },
    { key: "brand_name", value: "มีใจ คราฟต์" },
    { key: "brand_tagline", value: "เครื่องประดับ & อัญมณีคัดพิเศษ" },
    { key: "qrcode_url", value: "/images/qrcode/qrcode.jpg" },
    { key: "studio_image_url", value: "" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // Content images are managed via admin uploads (Supabase Storage).
  // Do not re-run seed on a database that already has cloud image URLs.
  const gems = [
    {
      slug: "diamond",
      name: "เพชร",
      origin: "แอฟริกาใต้ / บอตสวานา",
      color: "ใสบริสุทธิ์",
      detail: "มีประกายสูงและทนรอยขีดข่วน เหมาะกับเครื่องประดับที่ใส่ทุกวัน",
      hardnessMin: 10,
      hardnessMax: 10,
      hardnessDisplay: "10 Mohs",
      imageUrl: "/images/gem/diamond3.jpg",
      sortOrder: 0,
    },
    {
      slug: "ruby",
      name: "ทับทิม",
      origin: "พม่า / โมซัมบิก",
      color: "แดงเข้ม",
      detail: "เป็นพลอยแห่งพลังและความมั่นใจ นิยมทำแหวนและจี้",
      hardnessMin: 9,
      hardnessMax: 9,
      hardnessDisplay: "9 Mohs",
      imageUrl: "/images/gem/tubtim.jpg",
      sortOrder: 1,
    },
    {
      slug: "sapphire",
      name: "ไพลิน",
      origin: "ศรีลังกา / มาดากัสการ์",
      color: "น้ำเงินราชา",
      detail: "โทนสีสุขุมคลาสสิก เหมาะกับลุคหรูเรียบและใส่ง่าย",
      hardnessMin: 9,
      hardnessMax: 9,
      hardnessDisplay: "9 Mohs",
      imageUrl: "/images/gem/pailin.jpg",
      sortOrder: 2,
    },
    {
      slug: "emerald",
      name: "มรกต",
      origin: "โคลอมเบีย / แซมเบีย",
      color: "เขียวสด",
      detail: "เสน่ห์อยู่ที่เฉดเขียวธรรมชาติและลายภายในที่เป็นเอกลักษณ์",
      hardnessMin: 7.5,
      hardnessMax: 8,
      hardnessDisplay: "7.5-8 Mohs",
      imageUrl: "/images/gem/morakot.jpg",
      sortOrder: 3,
    },
    {
      slug: "yellow-sapphire",
      name: "บุษราคัม",
      origin: "ศรีลังกา / ไทย",
      color: "เหลืองทอง",
      detail: "สื่อถึงความมั่งคั่งและความรุ่งเรือง เหมาะกับงานตัวเรือนทอง",
      hardnessMin: 9,
      hardnessMax: 9,
      hardnessDisplay: "9 Mohs",
      imageUrl: "/images/gem/busracam.jpg",
      sortOrder: 4,
    },
    {
      slug: "amethyst",
      name: "อเมทิสต์",
      origin: "บราซิล / อุรุกวัย",
      color: "ม่วงใส",
      detail: "โทนม่วงนุ่ม ช่วยให้ลุคดูอ่อนโยนและมีเอกลักษณ์",
      hardnessMin: 7,
      hardnessMax: 7,
      hardnessDisplay: "7 Mohs",
      imageUrl: "/images/gem/amethyst.jpg",
      sortOrder: 5,
    },
    {
      slug: "peridot",
      name: "เพอริดอต",
      origin: "ปากีสถาน, เมียนมา",
      color: "เขียวมะกอก",
      detail: "",
      hardnessMin: 6.5,
      hardnessMax: 7,
      hardnessDisplay: "6.5-7 Mohs",
      imageUrl: "/images/gem/peridot.jpg",
      sortOrder: 6,
    },
    {
      slug: "opal",
      name: "โอปอล",
      origin: "Australia เป็นแหล่งใหญ่ที่สุด",
      color: "เล่นสีรุ้ง",
      detail: "",
      hardnessMin: 5.5,
      hardnessMax: 6.5,
      hardnessDisplay: "5.5-6.5 Mohs",
      imageUrl: "/images/gem/opal.png",
      sortOrder: 7,
    },
    {
      slug: "tanzanite",
      name: "แทนซาไนต์",
      origin: "พบหลักใน Tanzania เท่านั้น",
      color: "น้ำเงินอมม่วง",
      detail: "เป็นอัญมณีหายากที่มีแหล่งกำเนิดเพียงแห่งเดียวในโลกคือประเทศแทนซาเนีย",
      hardnessMin: 6.5,
      hardnessMax: 7,
      hardnessDisplay: "6.5-7 Mohs",
      imageUrl: "/images/gem/tanzanite.png",
      sortOrder: 8,
    },
    {
      slug: "moonstone",
      name: "มูนสโตน",
      origin: "Sri Lanka, India",
      color: "ขาวเหลือบฟ้า",
      detail: "",
      hardnessMin: 6,
      hardnessMax: 6.5,
      hardnessDisplay: "6-6.5 Mohs",
      imageUrl: "/images/gem/moonstone.jpg",
      sortOrder: 9,
    },
    {
      slug: "aquamarine",
      name: "อความารีน",
      origin: "Brazil, Pakistan",
      color: "ฟ้าอ่อน",
      detail: "",
      hardnessMin: 7.5,
      hardnessMax: 8,
      hardnessDisplay: "7.5-8 Mohs",
      imageUrl: "/images/gem/aquamarine.jpg",
      sortOrder: 10,
    },
  ];

  for (const gem of gems) {
    await prisma.gem.upsert({
      where: { slug: gem.slug },
      update: gem,
      create: gem,
    });
  }

  const luckyStones = [
    {
      slug: "onyx",
      name: "Onyx",
      meaning: "Protect",
      description: "หินแห่งการปกป้อง ช่วยให้แคล้วคลาดจากอันตราย",
      imageUrl: "/images/gem/onyx.jpg",
      sortOrder: 0,
    },
    {
      slug: "rose-quartz",
      name: "Rose Quartz",
      meaning: "Love",
      description: "หินแห่งความรักและความอ่อนโยน",
      imageUrl: "/images/gem/rosequarzt.jpg",
      sortOrder: 1,
    },
    {
      slug: "aventurine",
      name: "Aventurine",
      meaning: "Success",
      description: "หินแห่งโอกาสและความสำเร็จ",
      imageUrl: "/images/gem/aventurine2.jpg",
      sortOrder: 2,
    },
    {
      slug: "citrine",
      name: "Citrine",
      meaning: "Wealth",
      description: "หินแห่งความมั่งคั่งและความเจริญรุ่งเรือง",
      imageUrl: "/images/gem/citrine1.jpg",
      sortOrder: 3,
    },
    {
      slug: "garnet",
      name: "Garnet (โกเมน)",
      meaning: "Vitality",
      description:
        "โกเมนเป็นอัญมณีที่เชื่อกันว่าช่วยเสริมสิริมงคล นำพาโชคลาภ ความมั่นคง และพลังใจให้กับผู้สวมใส่",
      imageUrl: "/images/gem/garnet.jpg",
      sortOrder: 4,
    },
  ];

  for (const stone of luckyStones) {
    await prisma.luckyStone.upsert({
      where: { slug: stone.slug },
      update: stone,
      create: stone,
    });
  }

  const ringCategory = await prisma.jewelryCategory.upsert({
    where: { slug: "ring" },
    update: { name: "แหวน", displayMode: DisplayMode.SHOWCASE, sortOrder: 0 },
    create: {
      slug: "ring",
      name: "แหวน",
      displayMode: DisplayMode.SHOWCASE,
      sortOrder: 0,
    },
  });

  const penCategory = await prisma.jewelryCategory.upsert({
    where: { slug: "souvenir-pen" },
    update: { name: "ปากกาที่ระลึก", displayMode: DisplayMode.IMAGE_ONLY, sortOrder: 1 },
    create: {
      slug: "souvenir-pen",
      name: "ปากกาที่ระลึก",
      displayMode: DisplayMode.IMAGE_ONLY,
      sortOrder: 1,
    },
  });

  const ringImages = [
    "/images/Jewelry/ring/silv1.jpg",
    "/images/Jewelry/ring/silv2.jpg",
    "/images/Jewelry/ring/silv3.jpg",
    "/images/Jewelry/ring/silv4.jpg",
    "/images/Jewelry/ring/silv5.jpg",
    "/images/Jewelry/ring/silv6.jpg",
    "/images/Jewelry/ring/silv7.jpg",
    "/images/Jewelry/ring/silv8.jpg",
    "/images/Jewelry/ring/silv9.jpg",
    "/images/Jewelry/ring/silv10.jpg",
  ];

  const ringProduct = await prisma.jewelryProduct.upsert({
    where: { id: "seed-ring-product" },
    update: {
      categoryId: ringCategory.id,
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      accent: "925 silver",
      price: 3500,
    },
    create: {
      id: "seed-ring-product",
      categoryId: ringCategory.id,
      title: "แหวนเงิน",
      subtitle: "Silver Ring",
      description: "แหวนเงินงานคราฟต์ ดีไซน์เรียบหรู ใส่ได้ทั้งวันทำงานและวันพิเศษ",
      accent: "925 silver",
      price: 3500,
      sortOrder: 0,
    },
  });

  await prisma.jewelryProductImage.deleteMany({ where: { productId: ringProduct.id } });
  for (const [index, imageUrl] of ringImages.entries()) {
    await prisma.jewelryProductImage.create({
      data: {
        productId: ringProduct.id,
        imageUrl,
        sortOrder: index,
        isPrimary: index === 0,
      },
    });
  }

  const penProducts = [
    {
      title: "ปากกาที่ระลึก",
      subtitle: "Souvenir Pen",
      description: "ของขวัญพรีเมียม เหมาะสำหรับโอกาสพิเศษ",
      imageUrl: "/images/Jewelry/pen/pen1.jpg",
      accent: "Gift item",
      price: 890,
    },
    {
      title: "ปากกาที่ระลึก",
      subtitle: "Souvenir Pen",
      description: "ดีไซน์พรีเมียม เหมาะสำหรับเป็นของขวัญหรือของสะสม",
      imageUrl: "/images/Jewelry/pen/prn2.jpg",
      accent: "Collector piece",
      price: 990,
    },
    {
      title: "ปากกาที่ระลึก",
      subtitle: "Souvenir Pen",
      description: "ลุคเรียบหรู ใช้งานได้จริงในทุกวัน",
      imageUrl: "/images/Jewelry/pen/pen3.jpg",
      accent: "Daily premium",
      price: 790,
    },
  ];

  await prisma.jewelryProduct.deleteMany({ where: { categoryId: penCategory.id } });
  for (const [index, product] of penProducts.entries()) {
    await prisma.jewelryProduct.create({
      data: {
        categoryId: penCategory.id,
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        accent: product.accent,
        price: product.price,
        sortOrder: index,
        images: {
          create: [{ imageUrl: product.imageUrl, sortOrder: 0, isPrimary: true }],
        },
      },
    });
  }

  const workshopRingCategory = await prisma.workshopCategory.upsert({
    where: { slug: "silver-ring" },
    update: {
      name: "แหวนเงิน",
      description: "เวิร์คชอปทำแหวนเงิน เลือกดีไซน์ ขนาด ชุบสี และบริการเสริมได้ตามต้องการ",
      sortOrder: 0,
    },
    create: {
      slug: "silver-ring",
      name: "แหวนเงิน",
      description: "เวิร์คชอปทำแหวนเงิน เลือกดีไซน์ ขนาด ชุบสี และบริการเสริมได้ตามต้องการ",
      sortOrder: 0,
    },
  });

  const braceletCategory = await prisma.workshopCategory.upsert({
    where: { slug: "stone-bracelet" },
    update: {
      name: "กำไลหิน",
      description: "เวิร์คชอปทำกำไลหิน ออกแบบและเลือกหินได้ตามสไตล์",
      sortOrder: 1,
    },
    create: {
      slug: "stone-bracelet",
      name: "กำไลหิน",
      description: "เวิร์คชอปทำกำไลหิน ออกแบบและเลือกหินได้ตามสไตล์",
      sortOrder: 1,
    },
  });

  const workshop = await prisma.workshop.upsert({
    where: { slug: "silver-ring" },
    update: {
      categoryId: workshopRingCategory.id,
      title: "Workshop แหวนเงิน",
      summary: "เลือกดีไซน์ Classic หรือ Texture ขนาด 2–5 มม. ชุบทองคำขาว / ทอง / โรสโกลด์ และบริการเสริมฝังพลอยหรือเลเซอร์",
      featuredTitle: "ตัวอย่างแหวนเงิน",
      featuredSubtitle: "Silver Ring Workshop",
    },
    create: {
      slug: "silver-ring",
      categoryId: workshopRingCategory.id,
      title: "Workshop แหวนเงิน",
      summary: "เลือกดีไซน์ Classic หรือ Texture ขนาด 2–5 มม. ชุบทองคำขาว / ทอง / โรสโกลด์ และบริการเสริมฝังพลอยหรือเลเซอร์",
      featuredTitle: "ตัวอย่างแหวนเงิน",
      featuredSubtitle: "Silver Ring Workshop",
      sortOrder: 0,
    },
  });

  const braceletWorkshop = await prisma.workshop.upsert({
    where: { slug: "stone-bracelet" },
    update: {
      categoryId: braceletCategory.id,
      title: "Workshop กำไลหิน",
      summary: "ออกแบบกำไลหินด้วยตัวเอง เลือกสาย หิน และสไตล์ที่ชอบ",
      featuredTitle: "ตัวอย่างกำไลหิน",
      featuredSubtitle: "Stone Bracelet Workshop",
    },
    create: {
      slug: "stone-bracelet",
      categoryId: braceletCategory.id,
      title: "Workshop กำไลหิน",
      summary: "ออกแบบกำไลหินด้วยตัวเอง เลือกสาย หิน และสไตล์ที่ชอบ",
      featuredTitle: "ตัวอย่างกำไลหิน",
      featuredSubtitle: "Stone Bracelet Workshop",
      sortOrder: 0,
    },
  });

  await prisma.workshopBannerImage.deleteMany({ where: { workshopId: workshop.id } });
  const bannerImages = [
    "/images/banner/banner.jpg",
    "/images/banner/banner5.jpg",
    "/images/banner/banner7.jpg",
    "/images/banner/banner8.jpg",
    "/images/banner/banner14.jpg",
    "/images/banner/banner19.jpg",
    "/images/banner/banner20.jpg",
  ];
  for (const [index, imageUrl] of bannerImages.entries()) {
    await prisma.workshopBannerImage.create({
      data: { workshopId: workshop.id, imageUrl, sortOrder: index },
    });
  }

  await prisma.workshopFeaturedImage.deleteMany({ where: { workshopId: workshop.id } });
  for (const [index, imageUrl] of [
    "/images/workshop/silverring/silver2.jpg",
    "/images/workshop/silverring/silver1.jpg",
  ].entries()) {
    await prisma.workshopFeaturedImage.create({
      data: { workshopId: workshop.id, imageUrl, sortOrder: index },
    });
  }

  await prisma.workshopInfoCard.deleteMany({ where: { workshopId: workshop.id } });
  const infoCards = [
    { label: "ระยะเวลา", value: "ประมาณ 45 นาที - 1 ชั่วโมง" },
    { label: "ได้รับผลงาน", value: "นำแหวนกลับบ้านได้เลย" },
  ];
  for (const [index, card] of infoCards.entries()) {
    await prisma.workshopInfoCard.create({
      data: { workshopId: workshop.id, ...card, sortOrder: index },
    });
  }

  await prisma.workshopStep.deleteMany({ where: { workshopId: workshop.id } });
  const steps = [
    {
      title: "เลือกดีไซน์",
      description: "เลือกแบบแหวนระหว่างแหวนเกลี้ยงและแหวนทุบ (texture)",
    },
    {
      title: "เลือกวัสดุ",
      description: "เลือกขนาดหน้ากว้างแหวนมาตรฐาน 2, 3 หรือ 4 มม.",
    },
    {
      title: "ลงมือทำ",
      description: "ขึ้นรูปและตกแต่งแหวนเงินด้วยขั้นตอนเวิร์คชอปแบบ hands-on",
    },
    {
      title: "รับผลงาน",
      description: "รับแหวนเงินที่ทำเสร็จกลับบ้านได้ภายในคลาส",
    },
  ];
  for (const [index, step] of steps.entries()) {
    await prisma.workshopStep.create({
      data: { workshopId: workshop.id, ...step, sortOrder: index },
    });
  }

  await prisma.workshopListItem.deleteMany({ where: { workshopId: workshop.id } });
  const received = [
    "เลือกดีไซน์ Classic หรือ Texture ได้",
    "เลือกขนาดหน้ากว้างแหวน 2, 3, 4 หรือ 5 มม.",
    "เลือกชุบทองคำขาว ทอง หรือโรสโกลด์",
    "เพิ่มบริการฝังพลอยหรือเลเซอร์ได้",
    "ได้รับแหวนเงินที่ทำเสร็จกลับบ้าน",
  ];
  for (const [index, text] of received.entries()) {
    await prisma.workshopListItem.create({
      data: { workshopId: workshop.id, listType: WorkshopListType.RECEIVED, text, sortOrder: index },
    });
  }

  const terms = [
    "ขนาด 5 มม. กรุณาแจ้งแอดมินล่วงหน้าเท่านั้น และมีค่าใช้จ่ายเพิ่มเติม",
    "ราคาเวิร์คชอปคิดตามขนาดหน้ากว้างแหวนต่อท่าน",
    "บริการชุบสี ฝังพลอย และเลเซอร์อาจมีค่าใช้จ่ายเพิ่มเติมตามแบบ",
  ];

  await prisma.workshopOptionGroup.deleteMany({ where: { workshopId: workshop.id } });

  await prisma.workshopRingPrice.deleteMany({ where: { workshopId: workshop.id } });
  const ringSizePrices: Record<number, number | null> = {
    2: 1499,
    3: 1699,
    4: 1899,
    5: null,
  };
  const ringSizeNotes: Record<number, string | null> = {
    2: "บาท/ท่าน",
    3: "บาท/ท่าน",
    4: "บาท/ท่าน",
    5: "แจ้งแอดมินล่วงหน้า · มีค่าใช้จ่ายเพิ่มเติม",
  };
  const platings = [
    WorkshopPlatingType.WHITE_GOLD,
    WorkshopPlatingType.GOLD,
    WorkshopPlatingType.ROSE_GOLD,
  ];
  for (const style of [WorkshopRingStyle.CLASSIC, WorkshopRingStyle.TEXTURE]) {
    for (const sizeMm of [2, 3, 4, 5]) {
      for (const plating of platings) {
        await prisma.workshopRingPrice.create({
          data: {
            workshopId: workshop.id,
            style,
            sizeMm,
            plating,
            price: ringSizePrices[sizeMm],
            priceNote: ringSizeNotes[sizeMm],
          },
        });
      }
    }
  }

  await prisma.workshopAddon.deleteMany({ where: { workshopId: workshop.id } });
  await prisma.workshopAddon.createMany({
    data: [
      {
        workshopId: workshop.id,
        addonType: WorkshopAddonType.STONE_SETTING,
        label: "ฝังพลอย",
        price: null,
        priceNote: "สอบถามราคา",
        imageUrl: "/images/Jewelry/ring/ring2.jpg",
      },
      {
        workshopId: workshop.id,
        addonType: WorkshopAddonType.LASER,
        label: "เลเซอร์",
        price: null,
        priceNote: "สอบถามราคา",
        imageUrl: "/images/Jewelry/ring/ring3.jpg",
      },
    ],
  });

  await prisma.workshopRingSampleImage.deleteMany({ where: { workshopId: workshop.id } });
  const ringSampleImages: Array<{ sampleType: WorkshopRingSampleType; imageUrl: string }> = [
    { sampleType: WorkshopRingSampleType.STYLE_CLASSIC, imageUrl: "/images/workshop/silverring/silver1.jpg" },
    { sampleType: WorkshopRingSampleType.STYLE_TEXTURE, imageUrl: "/images/workshop/silverring/silver2.jpg" },
    { sampleType: WorkshopRingSampleType.SIZE_2MM, imageUrl: "/images/Jewelry/ring/silv1.jpg" },
    { sampleType: WorkshopRingSampleType.SIZE_3MM, imageUrl: "/images/Jewelry/ring/silv2.jpg" },
    { sampleType: WorkshopRingSampleType.SIZE_4MM, imageUrl: "/images/Jewelry/ring/silv3.jpg" },
    { sampleType: WorkshopRingSampleType.SIZE_5MM, imageUrl: "/images/Jewelry/ring/silv4.jpg" },
    { sampleType: WorkshopRingSampleType.PLATING_WHITE_GOLD, imageUrl: "/images/Jewelry/ring/silv5.jpg" },
    { sampleType: WorkshopRingSampleType.PLATING_GOLD, imageUrl: "/images/Jewelry/ring/silv7.jpg" },
    { sampleType: WorkshopRingSampleType.PLATING_ROSE_GOLD, imageUrl: "/images/Jewelry/ring/silv8.jpg" },
  ];
  for (const sample of ringSampleImages) {
    await prisma.workshopRingSampleImage.create({
      data: {
        workshopId: workshop.id,
        sampleType: sample.sampleType,
        imageUrl: sample.imageUrl,
      },
    });
  }

  /* legacy option groups removed — ring pricing matrix is the source of truth */

  await prisma.workshopBannerImage.deleteMany({ where: { workshopId: braceletWorkshop.id } });
  await prisma.workshopFeaturedImage.deleteMany({ where: { workshopId: braceletWorkshop.id } });
  await prisma.workshopInfoCard.deleteMany({ where: { workshopId: braceletWorkshop.id } });
  await prisma.workshopStep.deleteMany({ where: { workshopId: braceletWorkshop.id } });
  await prisma.workshopListItem.deleteMany({ where: { workshopId: braceletWorkshop.id } });
  await prisma.workshopOptionGroup.deleteMany({ where: { workshopId: braceletWorkshop.id } });

  for (const [index, imageUrl] of ["/images/banner/banner19.jpg"].entries()) {
    await prisma.workshopBannerImage.create({
      data: { workshopId: braceletWorkshop.id, imageUrl, sortOrder: index },
    });
  }
  for (const [index, imageUrl] of ["/images/banner/banner20.jpg"].entries()) {
    await prisma.workshopFeaturedImage.create({
      data: { workshopId: braceletWorkshop.id, imageUrl, sortOrder: index },
    });
  }
  for (const [index, card] of [
    { label: "ระยะเวลา", value: "ประมาณ 1 - 1.5 ชั่วโมง" },
    { label: "ได้รับผลงาน", value: "นำกำไลกลับบ้านได้เลย" },
  ].entries()) {
    await prisma.workshopInfoCard.create({
      data: { workshopId: braceletWorkshop.id, ...card, sortOrder: index },
    });
  }
  for (const [index, step] of [
    { title: "เลือกสายกำไล", description: "เลือกขนาดและสไตล์สายที่เหมาะกับข้อมือ" },
    { title: "เลือกหิน", description: "เลือกหินและจัดวางตามดีไซน์ที่ต้องการ" },
    { title: "ประกอบและตกแต่ง", description: "ประกอบกำไลและตกแต่งรายละเอียด" },
    { title: "รับผลงาน", description: "รับกำไลที่ทำเสร็จกลับบ้าน" },
  ].entries()) {
    await prisma.workshopStep.create({
      data: { workshopId: braceletWorkshop.id, ...step, sortOrder: index },
    });
  }
  for (const [index, text] of [
    "เลือกสายและหินได้ตามสไตล์",
    "ได้รับกำไลที่ทำเสร็จกลับบ้าน",
  ].entries()) {
    await prisma.workshopListItem.create({
      data: {
        workshopId: braceletWorkshop.id,
        listType: WorkshopListType.RECEIVED,
        text,
        sortOrder: index,
      },
    });
  }
  for (const [index, text] of terms.entries()) {
    await prisma.workshopListItem.create({
      data: { workshopId: workshop.id, listType: WorkshopListType.TERMS, text, sortOrder: index },
    });
  }
  for (const [index, text] of ["ราคาขึ้นอยู่กับสายและหินที่เลือก"].entries()) {
    await prisma.workshopListItem.create({
      data: {
        workshopId: braceletWorkshop.id,
        listType: WorkshopListType.TERMS,
        text,
        sortOrder: index,
      },
    });
  }

  const { ensureBraceletWorkshopOptions } = await import("../src/lib/ensure-bracelet-workshop-options");
  await ensureBraceletWorkshopOptions(braceletWorkshop.id);

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
