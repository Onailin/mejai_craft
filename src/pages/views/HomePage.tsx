import { useState } from "react";
import { HomeBanner } from "../../components/HomeBanner";
import type { PageContent } from "../types";

type GemProfile = {
  name: string;
  origin: string;
  hardness: number;
  hardnessDisplay: string;
  color: string;
  detail: string;
  image: string;
};

const gemShowcase: GemProfile[] = [
  {
    name: "เพชร",
    origin: "แอฟริกาใต้ / บอตสวานา",
    hardness: 10,
    hardnessDisplay: "10 Mohs",
    color: "ใสบริสุทธิ์",
    detail: "มีประกายสูงและทนรอยขีดข่วน เหมาะกับเครื่องประดับที่ใส่ทุกวัน",
    image: "/images/gem/diamond3.jpg",
  },
  {
    name: "ทับทิม",
    origin: "พม่า / โมซัมบิก",
    hardness: 9,
    hardnessDisplay: "9 Mohs",
    color: "แดงเข้ม",
    detail: "เป็นพลอยแห่งพลังและความมั่นใจ นิยมทำแหวนและจี้",
    image: "/images/gem/tubtim.jpg",
  },
  {
    name: "ไพลิน",
    origin: "ศรีลังกา / มาดากัสการ์",
    hardness: 9,
    hardnessDisplay: "9 Mohs",
    color: "น้ำเงินราชา",
    detail: "โทนสีสุขุมคลาสสิก เหมาะกับลุคหรูเรียบและใส่ง่าย",
    image: "/images/gem/pailin.jpg",
  },
  {
    name: "มรกต",
    origin: "โคลอมเบีย / แซมเบีย",
    hardness: 8,
    hardnessDisplay: "7.5-8 Mohs",
    color: "เขียวสด",
    detail: "เสน่ห์อยู่ที่เฉดเขียวธรรมชาติและลายภายในที่เป็นเอกลักษณ์",
    image: "/images/gem/morakot.jpg",
  },
  {
    name: "บุษราคัม",
    origin: "ศรีลังกา / ไทย",
    hardness: 9,
    hardnessDisplay: "9 Mohs",
    color: "เหลืองทอง",
    detail: "สื่อถึงความมั่งคั่งและความรุ่งเรือง เหมาะกับงานตัวเรือนทอง",
    image: "/images/gem/busracam.jpg",
  },
  {
    name: "อเมทิสต์",
    origin: "บราซิล / อุรุกวัย",
    hardness: 7,
    hardnessDisplay: "7 Mohs",
    color: "ม่วงใส",
    detail: "โทนม่วงนุ่ม ช่วยให้ลุคดูอ่อนโยนและมีเอกลักษณ์",
    image: "/images/gem/amethyst.jpg",
  },
];

export function HomePage({ page }: { page: PageContent }) {
  // เริ่มต้น State ที่ระดับ 9 (ไพลิน)
  const [selectedHardness, setSelectedHardness] = useState<number>(9);

  const activeGems = gemShowcase.filter((gem) => gem.hardness === selectedHardness);

  return (
    <>
      <HomeBanner page={page} />

      {/* Brand Statement */}
      <section className="mx-auto mt-20 max-w-4xl px-6 text-center sm:mt-28">
        <h2 className="font-serif text-3xl font-light tracking-wide text-stone-800 sm:text-4xl">
          มีใจ คราฟต์
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-500">
          งานคราฟต์อัญมณีที่ใส่ใจทุกรายละเอียด ผสานความงามตามธรรมชาติ
          กับดีไซน์ร่วมสมัยที่เหนือกาลเวลา
        </p>
        <div className="mx-auto mt-8 flex max-w-md justify-center gap-6 border-t border-stone-200 pt-8">
          {["Art", "Design", "Exhibition"].map((item) => (
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
                Interactive Lab
              </p>
              <h2 className="font-serif text-3xl font-light tracking-wide text-stone-800 sm:text-4xl">
                สเกลความแข็งของอัญมณี
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
                  <span>พลอยเนื้อแข็ง</span>
                  {selectedHardness >= 7.5 && <span className="h-1.5 w-1.5 rounded-full bg-stone-800" />}
                </h4>
                <p className="mt-1 text-xs text-stone-500">7.5-10 Mohs เหมาะกับแหวนและชิ้นที่ใช้ประจำวัน</p>
                <p className="mt-2 text-[11px] font-medium text-stone-400">เพชร · ทับทิม · ไพลิน</p>
              </article>

              <article
                className={`transition-all duration-500 border-l-2 py-3 pl-6 ${
                  selectedHardness < 7.5 
                    ? "border-stone-800 bg-stone-100/60 shadow-sm" 
                    : "border-stone-200 opacity-40"
                }`}
              >
                <h4 className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <span>พลอยเนื้ออ่อน</span>
                  {selectedHardness < 7.5 && <span className="h-1.5 w-1.5 rounded-full bg-stone-800" />}
                </h4>
                <p className="mt-1 text-xs text-stone-500">ต่ำกว่า 7 Mohs ต้องดูแลมากขึ้น เหมาะกับงานที่ไม่โดนกระแทก</p>
                <p className="mt-2 text-[11px] font-medium text-stone-400">โอปอล · ไข่มุก · เทอร์ควอยซ์</p>
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
                          <p className="text-[9px] uppercase tracking-wider text-stone-400">Origin</p>
                          <p className="text-xs font-medium text-stone-700">{gem.origin}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-stone-400">Color</p>
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
                <span className="font-serif text-xl italic">No gemstones active at {selectedHardness} Mohs</span>
                <p className="mt-1 text-xs max-w-xs">ระดับความแข็งนี้ส่วนใหญ่เป็นแร่ทั่วไป กรุณาเลื่อนสไลด์ไปที่ระดับ 7 - 10 เพื่อดูอัญมณีมีค่า</p>
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
            Collection
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-stone-800 sm:text-4xl">
            Gemstone Showcase
          </h2>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gemShowcase.map((gem) => (
            <article
              key={gem.name}
              className="group cursor-pointer"
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
                <p className="text-sm leading-relaxed text-stone-500">
                  {gem.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lucky Stones */}
      <section className="mx-auto mt-20 max-w-6xl px-6 pb-20 sm:mt-28 sm:pb-28">
        <header className="mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
            Beliefs & Meanings
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-stone-800 sm:text-4xl">
            Lucky Stones
          </h2>
        </header>

        <div className="-mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 pb-2">
          {[
            {
              name: "Onyx",
              meaning: "Protect",
              desc: "หินแห่งการปกป้อง ช่วยให้แคล้วคลาดจากอันตราย",
              image: "/images/gem/onyx.jpg",
            },
            {
              name: "Rose Quartz",
              meaning: "Love",
              desc: "หินแห่งความรักและความอ่อนโยน",
              image: "/images/gem/rosequarzt.jpg",
            },
            {
              name: "Aventurine",
              meaning: "Success",
              desc: "หินแห่งโอกาสและความสำเร็จ",
              image: "/images/gem/aventurine2.jpg",
            },
            {
              name: "Citrine",
              meaning: "Wealth",
              desc: "หินแห่งความมั่งคั่งและความเจริญรุ่งเรือง",
              image: "/images/gem/citrine1.jpg",
            },
            {
              name: "Garnet (โกเมน)",
              meaning: "Wealth",
              desc: "โกเมนเป็นอัญมณีที่เชื่อกันว่าช่วยเสริมสิริมงคล นำพาโชคลาภ ความมั่นคง และพลังใจให้กับผู้สวมใส่ ",
              image: "/images/gem/garnet.jpg",
            },

          ].map((stone) => (
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