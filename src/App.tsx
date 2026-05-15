import { useEffect, useMemo, useState } from "react";

type PageKey =
  | "home"
  | "raw-gems"
  | "gemstones"
  | "jewelry"
  | "workshop";

type ProductCard = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accent: string;
};

type PageContent = {
  id: PageKey;
  navLabel: string;
  title: string;
  eyebrow: string;
  description: string;
  cards: ProductCard[];
};

const pages: PageContent[] = [
  {
    id: "home",
    navLabel: "Home",
    title: "Mejai Craft",
    eyebrow: "Minimal Jewelry Atelier",
    description:
      "พื้นที่แนะนำอัญมณี เครื่องประดับ และเวิร์คชอปในบรรยากาศเรียบ สะอาด และหรูแบบพอดี",
    cards: [
      {
        title: "งานคราฟต์ที่เลือกได้ตามสไตล์",
        subtitle: "Gemstone & Jewelry",
        description:
          "เลือกชมพลอยดิบ อัญมณี และจิวเวลรี่ในหมวดที่ชัดเจน พร้อมภาพและคำอธิบายอ่านง่าย",
        image: "/images/banner/home.jpg",
        accent: "Mejai Craft",
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
    id: "raw-gems",
    navLabel: "พลอยดิบ",
    title: "Raw Gem Collection",
    eyebrow: "Natural Origin",
    description:
      "คัดโทนสี เนื้อพลอย และรูปทรงธรรมชาติ เหมาะสำหรับลูกค้าที่อยากเห็นเสน่ห์ก่อนเจียระไน",
    cards: [
      {
        title: "พลอยดิบสีชมพู",
        subtitle: "Pink Rough Stone",
        description: "สีหวาน เนื้อธรรมชาติ เหมาะสำหรับทำจี้หรือสะสมเป็นชิ้นพิเศษ",
        image:
          "/images/banner/banner1.jpg",
        accent: "Rose quartz tone",
      },
      {
        title: "พลอยดิบเขียว",
        subtitle: "Green Mineral",
        description: "โทนเขียวลึก ให้ความรู้สึกสงบ หรู และมีเอกลักษณ์แบบ organic luxury",
        image:
          "https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&w=900&q=80",
        accent: "Earth mineral",
      },
      {
        title: "คริสตัลธรรมชาติ",
        subtitle: "Natural Crystal",
        description: "ผิวสัมผัสดิบแต่ดูพรีเมียม เหมาะกับงานตกแต่งและงานดีไซน์เฉพาะตัว",
        image:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
        accent: "Collector piece",
      },
    ],
  },
  
  {
    id: "jewelry",
    navLabel: "จิวเวลรี่",
    title: "Fine Jewelry Pieces",
    eyebrow: "Curated Details",
    description:
      "รวมแหวน สร้อย กำไล และชิ้นงานสั่งทำในโทนพรีเมียม เน้นภาพใหญ่ อ่านง่าย และเลือกชมเป็นหมวด",
    cards: [
      {
        title: "แหวนพลอยกลาง",
        subtitle: "Statement Ring",
        description: "ชูพลอยเม็ดหลักด้วยตัวเรือนเรียบ ทำให้ชิ้นงานดูหรูโดยไม่รกสายตา",
        image:
          "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80",
        accent: "Center stone",
      },
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
        image:
          "/images/workshop/workshop1.jpg",
        accent: "Custom idea",
      },
      {
        title: "เลือกพลอยและวัสดุ",
        subtitle: "Material Selection",
        description: "เรียนรู้ความต่างของพลอย สี ตัวเรือน และผิวงานก่อนเริ่มทำจริง",
        image:
          "/images/workshop/workshop2.jpg",
        accent: "Material table",
      },
      {
        title: "ทำชิ้นงานด้วยมือ",
        subtitle: "Craft Moment",
        description: "ได้สัมผัสขั้นตอนพื้นฐานของงานจิวเวลรี่ พร้อมคำแนะนำจากทีมงาน",
        image:
          "/images/workshop/workshop3.jpg",
        accent: "Workshop day",
      },
    ],
  },
];

const defaultPage = pages[0].id;

function getHashPage(): PageKey {
  const hash = window.location.hash.replace("#", "");
  return pages.some((page) => page.id === hash) ? (hash as PageKey) : defaultPage;
}

function ProductCard({ card }: { card: ProductCard }) {
  return (
    <article className="group w-[84vw] max-w-[380px] shrink-0 snap-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md sm:w-auto sm:max-w-none">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={card.image}
          alt={card.title}
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-700 backdrop-blur">
          {card.accent}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <p className="font-sans text-sm text-gray-500">{card.subtitle}</p>
          <h3 className="mt-1 font-sans text-xl font-semibold text-luxury-ink">
            {card.title}
          </h3>
        </div>
        <p className="text-sm leading-7 text-luxury-muted">{card.description}</p>
      </div>
    </article>
  );
}

function HomeBanner({ page }: { page: PageContent }) {
  const heroCard = page.cards[0];

  return (
    <section className="relative min-h-[calc(100svh-73px)] overflow-hidden bg-gray-100">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={heroCard.image}
        alt={heroCard.title}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
      <div className="relative mx-auto flex min-h-[calc(100svh-73px)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gray-500">
            {page.eyebrow}
          </p>
          <h1 className="font-sans text-5xl font-semibold leading-tight text-luxury-ink sm:text-6xl lg:text-7xl">
            {page.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-luxury-muted sm:text-lg">
            {page.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white no-underline shadow-sm hover:bg-gray-700"
              href="#jewelry"
            >
              ชมคอลเลกชัน
            </a>
            <a
              className="rounded-full border border-gray-300 bg-white/75 px-6 py-3 text-sm font-semibold text-luxury-ink no-underline backdrop-blur hover:bg-white"
              href="#workshop"
            >
              ข้อมูลเวิร์คชอป
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkshopBanner({ page }: { page: PageContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = page.cards[activeIndex] ?? page.cards[0];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % page.cards.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [page.cards.length]);

  return (
    <section>
      <div className="mb-7 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gray-500">
          {page.eyebrow}
        </p>
        <h1 className="font-sans text-4xl font-semibold leading-tight text-luxury-ink sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-5 text-base leading-8 text-luxury-muted sm:text-lg">
          {page.description}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] bg-gray-100 shadow-sm">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {page.cards.map((card) => (
            <div key={card.title} className="h-[430px] w-full shrink-0 sm:h-[560px]">
              <img
                className="h-full w-full object-cover"
                src={card.image}
                alt={card.title}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {page.cards.map((card, index) => (
          <button
            type="button"
            key={card.title}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition ${
              activeIndex === index ? "w-8 bg-gray-900" : "w-2 bg-gray-300"
            }`}
            aria-label={`ไปยังสไลด์ ${index + 1}`}
          />
        ))}
      </div>

      <section className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-5">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Workshop Info</p>
            <h2 className="mt-3 text-3xl font-semibold text-luxury-ink">รายละเอียดเวิร์คชอป</h2>
            <p className="mt-4 text-sm leading-7 text-luxury-muted">
              เทมเพลตนี้เตรียมไว้สำหรับใส่ข้อมูลเวิร์คชอปจริงภายหลัง โดยจัดรูปแบบให้อ่านง่าย
              และดูมินิมอลพร้อมรูปประกอบ
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v5l3 2" />
                  </svg>
                </div>
                <p className="font-semibold text-luxury-ink">ระยะเวลา</p>
                <p className="mt-1 text-sm text-luxury-muted">เช่น 2-3 ชั่วโมง</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <path d="M5 20v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
                    <circle cx="12" cy="8" r="3" />
                  </svg>
                </div>
                <p className="font-semibold text-luxury-ink">จำนวนผู้เข้าร่วม</p>
                <p className="mt-1 text-sm text-luxury-muted">เช่น 1-6 คน/รอบ</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                </div>
                <p className="font-semibold text-luxury-ink">ราคาเริ่มต้น</p>
                <p className="mt-1 text-sm text-luxury-muted">เช่น 1,990 บาท</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>
                <p className="font-semibold text-luxury-ink">สถานที่</p>
                <p className="mt-1 text-sm text-luxury-muted">หน้าร้าน / สตูดิโอ</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-semibold text-luxury-ink">ขั้นตอนในคลาส</h3>
            <div className="mt-5 grid gap-4">
              {["เลือกดีไซน์", "เลือกวัสดุ", "ลงมือทำ", "รับผลงาน"].map((step, index) => (
                <div key={step} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-sm font-semibold text-luxury-ink">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-luxury-ink">{step}</p>
                    <p className="mt-1 text-sm leading-6 text-luxury-muted">
                      ใส่รายละเอียดขั้นตอนนี้ภายหลัง
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
            <img
              className="h-[300px] w-full rounded-2xl object-cover sm:h-[360px]"
              src={activeCard.image}
              alt={activeCard.title}
            />
            <div className="p-3">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{activeCard.subtitle}</p>
              <p className="mt-2 text-lg font-semibold text-luxury-ink">{activeCard.title}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-luxury-ink">สิ่งที่ได้รับ</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-luxury-muted">
              <li>• รายการอุปกรณ์ที่รวมในคลาส</li>
              <li>• ชิ้นงานที่ทำเสร็จกลับบ้าน</li>
              <li>• ภาพบรรยากาศระหว่างเวิร์คชอป</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-luxury-ink">เงื่อนไขการจอง</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-luxury-muted">
              <li>• จองล่วงหน้าอย่างน้อย 1-2 วัน</li>
              <li>• แจ้งเลื่อนรอบได้ตามเงื่อนไขร้าน</li>
              <li>• เพิ่มข้อมูลการติดต่อ / LINE / โทรในส่วนนี้</li>
            </ul>
          </div>
        </div>
      </section>
    </section>
  );
}

export function App() {
  const [activePageId, setActivePageId] = useState<PageKey>(() => getHashPage());

  useEffect(() => {
    const syncHash = () => setActivePageId(getHashPage());
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId]
  );
  const isHome = activePage.id === "home";
  const isWorkshop = activePage.id === "workshop";

  return (
    <div className="min-h-dvh overflow-hidden bg-[#f7f7f5] font-sans text-luxury-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0,transparent_45%)]" />

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <a href={`#${defaultPage}`} className="flex items-center gap-3 text-luxury-ink no-underline">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-gray-50 font-sans text-base text-gray-700">
              M
            </span>
            <span>
              <span className="block font-sans text-xl font-semibold tracking-wide">
                Mejai Craft
              </span>
              <span className="block text-xs uppercase tracking-[0.28em] text-luxury-muted">
                Fine Gem Atelier
              </span>
            </span>
          </a>

          <nav
            className="flex gap-2 overflow-x-auto pb-1 text-sm lg:justify-end lg:overflow-visible lg:pb-0"
            aria-label="หมวดสินค้า"
          >
            {pages.map((page) => {
              const isActive = page.id === activePage.id;
              return (
                <a
                  key={page.id}
                  href={`#${page.id}`}
                  className={`shrink-0 rounded-full border px-4 py-2 no-underline transition ${
                    isActive
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-luxury-ink hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page.navLabel}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      <main
        className={
          isHome
            ? "relative z-10 pb-14"
            : "relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-8"
        }
      >
        {isHome ? (
          <HomeBanner page={activePage} />
        ) : isWorkshop ? (
          <WorkshopBanner page={activePage} />
        ) : (
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gray-500">
                {activePage.eyebrow}
              </p>
              <h1 className="font-sans text-4xl font-semibold leading-tight text-luxury-ink sm:text-5xl lg:text-6xl">
                {activePage.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-luxury-muted sm:text-lg">
                {activePage.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_16px_40px_rgba(31,41,55,0.18)] hover:bg-gray-700"
                  href="#workshop"
                >
                  ดูข้อมูลเวิร์คชอป
                </a>
                <a
                  className="rounded-full border border-gray-300 bg-white/70 px-6 py-3 text-sm font-semibold text-luxury-ink no-underline hover:border-gray-500 hover:bg-white"
                  href="#jewelry"
                >
                  ชมจิวเวลรี่
                </a>
              </div>
            </div>

            <div className="relative hidden min-h-[390px] lg:block">
              <div className="relative ml-auto max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
                <img
                  className="h-[370px] w-full rounded-2xl object-cover"
                  src={activePage.cards[0].image}
                  alt={activePage.cards[0].title}
                />
                <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/70 bg-white/85 p-5 backdrop-blur-md">
                  <p className="font-sans text-2xl text-luxury-ink">{activePage.cards[0].title}</p>
                  <p className="mt-2 text-sm leading-6 text-luxury-muted">
                    {activePage.cards[0].description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {!isWorkshop ? (
          <section
            className={
              isHome
                ? "mx-auto mt-12 max-w-7xl px-4 sm:mt-16 sm:px-6 lg:px-8"
                : "mt-12 sm:mt-16"
            }
          >
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-gray-500">
                  Selected Boxes
                </p>
                <h2 className="mt-2 font-sans text-3xl font-semibold text-luxury-ink sm:text-4xl">
                  {activePage.navLabel}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-luxury-muted">
                บนมือถือสามารถเลื่อนซ้าย-ขวาเพื่อดูการ์ดขนาดใหญ่ ส่วน browser จะจัดเป็น grid ให้สมส่วน
              </p>
            </div>

            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
              {activePage.cards.map((card) => (
                <ProductCard key={card.title} card={card} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="relative z-10 border-t border-gray-200 bg-white/55 px-4 py-8 text-center text-sm text-luxury-muted">
        © Mejai Craft · Luxury gemstone and jewelry information
      </footer>
    </div>
  );
}
