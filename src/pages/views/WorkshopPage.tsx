import { useEffect, useState } from "react";
import { WorkshopBanner } from "../../components/WorkshopBanner";
import type { PageContent } from "../types";

type WorkshopDetail = {
  workshopTitle: string;
  workshopSummary: string;
  featuredImages: string[];
  featuredSubtitle: string;
  featuredTitle: string;
  infoCards: Array<{ label: string; value: string }>;
  classSteps: Array<{ title: string; description: string }>;
  receivedItems: string[];
  bookingTerms: string[];
};

const workshopDetail: WorkshopDetail = {
  workshopTitle: "Workshop แหวนเงิน",
  workshopSummary: "ใช้เวลาประมาณ 1-1.30 ชั่วโมง และได้รับผลงานกลับบ้านด้วยทุกท่าน",
  featuredImages: [
    "/images/workshop/silverring/silver2.jpg",
    "/images/workshop/silverring/silver1.jpg",
  ],
  featuredSubtitle: "Silver Ring Workshop",
  featuredTitle: "บรรยากาศเวิร์คชอปแหวนเงิน",
  infoCards: [
    { label: "ระยะเวลา", value: "ประมาณ 1-1.30 ชั่วโมง" },
    { label: "ได้รับผลงาน", value: "นำแหวนกลับบ้านได้เลย" },
    { label: "ราคา 2 มม.", value: "1,499 บาท/ท่าน" },
    { label: "ราคา 3-4 มม.", value: "3 มม. 1,699 บาท · 4 มม. 1,899 บาท" },
  ],
  classSteps: [
    { title: "เลือกดีไซน์", description: "เลือกแบบแหวนระหว่างแหวนเกลี้ยงและแหวนทุบ (texture)" },
    { title: "เลือกวัสดุ", description: "เลือกขนาดหน้ากว้างแหวนมาตรฐาน 2, 3 หรือ 4 มม." },
    { title: "ลงมือทำ", description: "ขึ้นรูปและตกแต่งแหวนเงินด้วยขั้นตอนเวิร์คชอปแบบ hands-on" },
    { title: "รับผลงาน", description: "รับแหวนเงินที่ทำเสร็จกลับบ้านได้ภายในคลาส" },
  ],
  receivedItems: [
    "เลือกแบบแหวนได้ 2 แบบ: แหวนเกลี้ยง หรือ แหวนทุบ (texture)",
    "ขนาดหน้ากว้างมาตรฐาน 2, 3 และ 4 มม.",
    "ได้รับแหวนเงินที่ทำเสร็จกลับบ้าน",
  ],
  bookingTerms: [
    "หากต้องการหน้ากว้างพิเศษ 5 มม. กรุณาแจ้งแอดมินล่วงหน้าเท่านั้น",
    "ขนาด 5 มม. มีค่าใช้จ่ายเพิ่มเติม",
    "ราคาเวิร์คชอปคิดตามขนาดหน้ากว้างแหวนต่อท่าน",
  ],
};

export function WorkshopPage({ page }: { page: PageContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % page.cards.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [page.cards.length]);

  useEffect(() => {
    if (workshopDetail.featuredImages.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % workshopDetail.featuredImages.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="pb-16">
      <WorkshopBanner page={page} activeIndex={activeIndex} onSelectIndex={setActiveIndex} />

      <section className="mx-auto mt-20 grid max-w-6xl gap-8 px-6 lg:grid-cols-2 lg:gap-12">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Workshop Info */}
          <article className="space-y-6">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
              Workshop
            </span>
            <h2 className="text-4xl font-light tracking-tight text-neutral-900">
              {workshopDetail.workshopTitle}
            </h2>
            <p className="text-base leading-relaxed text-neutral-500">
              {workshopDetail.workshopSummary}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {workshopDetail.infoCards.map((card) => (
                <div
                  key={card.label}
                  className="border-l border-neutral-200 py-2 pl-5"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">{card.value}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Class Steps */}
          <article className="space-y-6 pt-8">
            <h3 className="text-lg font-medium tracking-tight text-neutral-900">
              ขั้นตอนในคลาส
            </h3>
            <div className="space-y-6">
              {workshopDetail.classSteps.map((step, index) => (
                <div key={step.title} className="flex items-start gap-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
                    {index + 1}
                  </span>
                  <div className="pt-1">
                    <p className="text-sm font-medium text-neutral-900">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Featured Image */}
          <figure className="group overflow-hidden">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${featuredIndex * 100}%)` }}
              >
                {workshopDetail.featuredImages.map((imagePath) => (
                  <img
                    key={imagePath}
                    className="aspect-[4/3] w-full shrink-0 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    src={imagePath}
                    alt={workshopDetail.featuredTitle}
                  />
                ))}
              </div>
            </div>
            <figcaption className="mt-4 space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">
                {workshopDetail.featuredSubtitle}
              </p>
              <p className="text-lg font-light text-neutral-900">{workshopDetail.featuredTitle}</p>
            </figcaption>
            {workshopDetail.featuredImages.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {workshopDetail.featuredImages.map((imagePath, index) => (
                  <button
                    type="button"
                    key={imagePath}
                    onClick={() => setFeaturedIndex(index)}
                    className={`h-2 rounded-full transition ${
                      featuredIndex === index ? "w-8 bg-neutral-900" : "w-2 bg-neutral-300"
                    }`}
                    aria-label={`ไปยังรูปเวิร์คชอป ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </figure>

          {/* What You Get */}
          <article className="space-y-4 border-t border-neutral-100 pt-8">
            <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-900">
              สิ่งที่ได้รับ
            </h3>
            <ul className="space-y-3">
              {workshopDetail.receivedItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-neutral-600"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* Booking Terms */}
          <article className="space-y-4 border-t border-neutral-100 pt-8">
            <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-900">
              เงื่อนไขการจอง
            </h3>
            <ul className="space-y-3">
              {workshopDetail.bookingTerms.map((term) => (
                <li
                  key={term}
                  className="flex items-start gap-3 text-sm leading-relaxed text-neutral-600"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
                  {term}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </section>
  );
}
