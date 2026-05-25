import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HomeBanner } from "../../components/HomeBanner";
import type { PageContent } from "../types";

type GemProfile = {
  name: string;
  origin: string;
  hardnessMin: number;
  hardnessMax: number;
  hardnessDisplay: string;
  color: string;
  detail: string;
  image: string;
};

type LuckyStone = {
  name: string;
  meaning: string;
  desc: string;
  image: string;
};

export function HomePage({ page }: { page: PageContent }) {
  const { t } = useTranslation();
  const gemShowcase: GemProfile[] = [
    {
      name: t("home.gems.diamond.name"),
      origin: t("home.gems.diamond.origin"),
      hardnessMin: 10,
      hardnessMax: 10,
      hardnessDisplay: t("home.gems.diamond.hardness"),
      color: t("home.gems.diamond.color"),
      detail: t("home.gems.diamond.detail"),
      image: "/images/gem/diamond3.jpg",
    },
    {
      name: t("home.gems.ruby.name"),
      origin: t("home.gems.ruby.origin"),
      hardnessMin: 9,
      hardnessMax: 9,
      hardnessDisplay: t("home.gems.ruby.hardness"),
      color: t("home.gems.ruby.color"),
      detail: t("home.gems.ruby.detail"),
      image: "/images/gem/tubtim.jpg",
    },
    {
      name: t("home.gems.sapphire.name"),
      origin: t("home.gems.sapphire.origin"),
      hardnessMin: 9,
      hardnessMax: 9,
      hardnessDisplay: t("home.gems.sapphire.hardness"),
      color: t("home.gems.sapphire.color"),
      detail: t("home.gems.sapphire.detail"),
      image: "/images/gem/pailin.jpg",
    },
    {
      name: t("home.gems.emerald.name"),
      origin: t("home.gems.emerald.origin"),
      hardnessMin: 7.5,
      hardnessMax: 8,
      hardnessDisplay: t("home.gems.emerald.hardness"),
      color: t("home.gems.emerald.color"),
      detail: t("home.gems.emerald.detail"),
      image: "/images/gem/morakot.jpg",
    },
    {
      name: t("home.gems.yellow_sapphire.name"),
      origin: t("home.gems.yellow_sapphire.origin"),
      hardnessMin: 9,
      hardnessMax: 9,
      hardnessDisplay: t("home.gems.yellow_sapphire.hardness"),
      color: t("home.gems.yellow_sapphire.color"),
      detail: t("home.gems.yellow_sapphire.detail"),
      image: "/images/gem/busracam.jpg",
    },
    {
      name: t("home.gems.amethyst.name"),
      origin: t("home.gems.amethyst.origin"),
      hardnessMin: 7,
      hardnessMax: 7,
      hardnessDisplay: t("home.gems.amethyst.hardness"),
      color: t("home.gems.amethyst.color"),
      detail: t("home.gems.amethyst.detail"),
      image: "/images/gem/amethyst.jpg",
    },
    {
      name: t("home.birthstone_table.rows.august.gem_th"),
      origin: t("home.birthstone_table.rows.august.origin"),
      hardnessDisplay: t("home.birthstone_table.rows.august.hardness"),
      hardnessMin: 6.5,
      hardnessMax: 7,
      color: t("home.birthstone_table.rows.august.color"),
      detail: "",
      image: "/images/gem/peridot.jpg",
    },
    {
      name: t("home.birthstone_table.rows.october_opal.gem_th"),
      origin: t("home.birthstone_table.rows.october_opal.origin"),
      hardnessDisplay: t("home.birthstone_table.rows.october_opal.hardness"),
      hardnessMin: 5.5,
      hardnessMax: 6.5,
      color: t("home.birthstone_table.rows.october_opal.color"),
      detail: "",
      image: "/images/gem/opal.png",
    },
    {
      name: t("home.birthstone_table.rows.december.gem_th"),
      origin: t("home.birthstone_table.rows.december.origin"),
      hardnessDisplay: t("home.birthstone_table.rows.december.hardness"),
      hardnessMin: 6.5,
      hardnessMax: 7,
      color: t("home.birthstone_table.rows.december.color"),
      detail: "เป็นอัญมณีหายากที่มีแหล่งกำเนิดเพียงแห่งเดียวในโลกคือประเทศแทนซาเนีย โดดเด่นด้วยสีน้ำเงินแกมม่วง ",
      image: "/images/gem/tanzanite.png",
    },
    {
      name: t("home.birthstone_table.rows.june.gem_th"),
      origin: t("home.birthstone_table.rows.june.origin"),
      hardnessDisplay: t("home.birthstone_table.rows.june.hardness"),
      hardnessMin: 6,
      hardnessMax: 6.5,
      color: t("home.birthstone_table.rows.june.color"),
      detail: "",
      image: "/images/gem/moonstone.jpg",
    },
    {
      name: t("home.birthstone_table.rows.march.gem_th"),
      origin: t("home.birthstone_table.rows.march.origin"),
      hardnessDisplay: t("home.birthstone_table.rows.march.hardness"),
      hardnessMin: 7.5,
      hardnessMax: 8,
      color: t("home.birthstone_table.rows.march.color"),
      detail: "",
      image: "/images/gem/aquamarine.jpg",
    },
  ];
  const luckyStones: LuckyStone[] = [
    {
      name: t("home.lucky_stones.onyx.name"),
      meaning: t("home.lucky_stones.onyx.meaning"),
      desc: t("home.lucky_stones.onyx.desc"),
      image: "/images/gem/onyx.jpg",
    },
    {
      name: t("home.lucky_stones.rose_quartz.name"),
      meaning: t("home.lucky_stones.rose_quartz.meaning"),
      desc: t("home.lucky_stones.rose_quartz.desc"),
      image: "/images/gem/rosequarzt.jpg",
    },
    {
      name: t("home.lucky_stones.aventurine.name"),
      meaning: t("home.lucky_stones.aventurine.meaning"),
      desc: t("home.lucky_stones.aventurine.desc"),
      image: "/images/gem/aventurine2.jpg",
    },
    {
      name: t("home.lucky_stones.citrine.name"),
      meaning: t("home.lucky_stones.citrine.meaning"),
      desc: t("home.lucky_stones.citrine.desc"),
      image: "/images/gem/citrine1.jpg",
    },
    {
      name: t("home.lucky_stones.garnet.name"),
      meaning: t("home.lucky_stones.garnet.meaning"),
      desc: t("home.lucky_stones.garnet.desc"),
      image: "/images/gem/garnet.jpg",
    },
  ];
  // เริ่มต้น State ที่ระดับ 9 (ไพลิน)
  const [selectedHardness, setSelectedHardness] = useState<number>(9);

  const activeGems = gemShowcase.filter(
    (gem) => selectedHardness >= gem.hardnessMin && selectedHardness <= gem.hardnessMax
  );

  return (
    <>
      <HomeBanner page={page} />

      {/* Brand Statement */}
      <section className="mx-auto mt-20 max-w-4xl px-6 text-center sm:mt-28">
        <h2 className="font-serif text-3xl font-light tracking-wide text-stone-800 sm:text-4xl">
          {t("home.brand_title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-500">
          {t("home.brand_desc")}
        </p>
        <div className="mx-auto mt-8 flex max-w-md justify-center gap-6 border-t border-stone-200 pt-8">
          {[
            t("home.tag_1"),
            t("home.tag_2"),
            t("home.tag_3"),
          ].map((item) => (
            <span
              key={item}
              className="text-xs uppercase tracking-[0.25em] text-stone-400"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* --- INTERACTIVE GEM FOCUS SECTION --- */}
      <section className="mt-20 border-y border-stone-200 bg-stone-50 py-16 sm:mt-28 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          
          {/* Header & Graphic Slider Control */}
          <div className="mb-16 space-y-8 text-center">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400">
                {t("home.interactive_label")}
              </p>
              <h2 className="font-serif text-3xl font-light tracking-wide text-stone-800 sm:text-4xl">
                {t("home.interactive_title")}
              </h2>
            </div>

            {/* แถบกราฟิกสไลด์ขนาดใหญ่ */}
            <div className="mx-auto max-w-4xl px-4">
              <div className="relative flex flex-col items-center">
                
                {/* ตัวเลขสเกลใหญ่ด้านหลัง */}
                <div className="absolute -top-10 font-mono text-[7rem] font-bold leading-none text-stone-200/60 select-none">
                  {selectedHardness}
                </div>

                {/* Input Range Slider */}
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={selectedHardness}
                  onChange={(e) => setSelectedHardness(Number(e.target.value))}
                  className="relative z-10 h-1 w-full cursor-pointer appearance-none bg-stone-300 accent-stone-800 focus:outline-none"
                />

                {/* จุดบอกตำแหน่งเลข 1-10 ด้านล่างสเกล */}
                <div className="mt-4 flex w-full justify-between px-1 font-mono text-xs text-stone-400">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedHardness(num)}
                      className={`transition-all duration-300 ${
                        selectedHardness === num
                          ? "font-bold scale-125 text-stone-800"
                          : "hover:text-stone-600"
                      }`}
                    >
                      {num === 10 ? "10 Mohs" : num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ส่วนข้อมูลพลอยเนื้อแข็ง / พลอยเนื้ออ่อน (ปรับดีไซน์ให้ตอบสนองกับสเกลที่เลือกด้วยเส้นขอบหนาขึ้น) */}
            <div className="mx-auto grid max-w-3xl gap-6 pt-4 text-left sm:grid-cols-2">
              <article
                className={`transition-all duration-500 border-l-2 py-3 pl-6 ${
                  selectedHardness >= 7.5 
                    ? "border-stone-800 bg-stone-100/60 shadow-sm" 
                    : "border-stone-200 opacity-40"
                }`}
              >
                <h4 className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <span>{t("home.hard_gem_title")}</span>
                  {selectedHardness >= 7.5 && <span className="h-1.5 w-1.5 rounded-full bg-stone-800" />}
                </h4>
                <p className="mt-1 text-xs text-stone-500">{t("home.hard_gem_desc")}</p>
                <p className="mt-2 text-[11px] font-medium text-stone-400">{t("home.hard_gem_examples")}</p>
              </article>

              <article
                className={`transition-all duration-500 border-l-2 py-3 pl-6 ${
                  selectedHardness < 7.5 
                    ? "border-stone-800 bg-stone-100/60 shadow-sm" 
                    : "border-stone-200 opacity-40"
                }`}
              >
                <h4 className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <span>{t("home.soft_gem_title")}</span>
                  {selectedHardness < 7.5 && <span className="h-1.5 w-1.5 rounded-full bg-stone-800" />}
                </h4>
                <p className="mt-1 text-xs text-stone-500">{t("home.soft_gem_desc")}</p>
                <p className="mt-2 text-[11px] font-medium text-stone-400">{t("home.soft_gem_examples")}</p>
              </article>
            </div>
          </div>

          {/* ส่วนแสดงรายละเอียดพลอยตามระดับที่เลือก */}
          <div className="min-h-[350px]">
            {activeGems.length > 0 ? (
              <div className={`grid gap-12 items-center ${activeGems.length > 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
                
                {/* ฝั่งเนื้อหา */}
                <div className={`space-y-8 ${activeGems.length > 1 ? 'lg:col-span-2 grid sm:grid-cols-2 gap-8 space-y-0' : ''}`}>
                  {activeGems.map((gem) => (
                    <article key={gem.name} className="space-y-4 border-l border-stone-300 pl-6">
                      <span className="inline-block bg-stone-800 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                        {gem.hardnessDisplay}
                      </span>
                      <h3 className="font-serif text-4xl font-light text-stone-800">
                        {gem.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-stone-500">
                        {gem.detail}
                      </p>
                      <div className="flex gap-8 pt-2">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-stone-400">{t("home.origin")}</p>
                          <p className="text-xs font-medium text-stone-700">{gem.origin}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-stone-400">{t("home.color")}</p>
                          <p className="text-xs font-medium text-stone-700">{gem.color}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* ฝั่งรูปภาพ */}
                <div className="overflow-hidden bg-stone-200 aspect-[4/3] sm:aspect-[16/10] lg:aspect-square max-w-md mx-auto w-full shadow-sm">
                  <img
                    key={activeGems[0].name}
                    className="h-full w-full object-cover"
                    src={activeGems[0].image}
                    alt={activeGems[0].name}
                  />
                </div>

              </div>
            ) : (
              /* หน้าว่างในกรณีไม่มีผลลัพธ์ */
              <div className="flex flex-col items-center justify-center py-12 text-center text-stone-400">
                <span className="font-serif text-xl italic">{t("home.no_gem_title", { hardness: selectedHardness })}</span>
                <p className="mt-1 text-xs max-w-xs">{t("home.no_gem_desc")}</p>
              </div>
            )}
          </div>

        </div>
      </section>
      {/* ---------------------------------------------------- */}

      {/* Gemstone Showcase */}
      <section className="mx-auto mt-20 max-w-6xl px-6 sm:mt-28">
        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
            {t("home.collection_label")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-stone-800 sm:text-4xl">
            {t("home.collection_title")}
          </h2>
        </header>

        <div className="-mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {gemShowcase.map((gem) => (
            <article
              key={`${gem.name}-${gem.hardnessDisplay}`}
              className="group w-[78%] shrink-0 snap-start cursor-pointer sm:w-auto sm:shrink"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={gem.image}
                  alt={gem.name}
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-lg text-stone-800">
                    {gem.name}
                  </h3>
                  <span className="text-xs text-stone-400">{gem.hardnessDisplay}</span>
                </div>
                <p className="text-xs text-stone-400">
                  {gem.origin} · {gem.color}
                </p>
                {gem.detail && (
                  <p className="text-sm leading-relaxed text-stone-500">
                    {gem.detail}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lucky Stones */}
      <section className="mx-auto mt-20 max-w-6xl px-6 pb-20 sm:mt-28 sm:pb-28">
        <header className="mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
            {t("home.lucky_label")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-stone-800 sm:text-4xl">
            {t("home.lucky_title")}
          </h2>
        </header>

        <div className="-mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 pb-2">
          {luckyStones.map((stone) => (
            <article
              key={stone.name}
              className="group w-[78%] shrink-0 snap-start cursor-pointer sm:w-[48%] lg:w-[32%] xl:w-[24%]"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
                <img
                  src={stone.image}
                  alt={stone.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
                  {stone.meaning}
                </p>
                <h3 className="font-serif text-lg text-stone-800">{stone.name}</h3>
                <p className="text-sm leading-relaxed text-stone-500">
                  {stone.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}