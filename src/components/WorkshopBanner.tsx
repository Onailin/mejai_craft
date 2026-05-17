import type { PageContent } from "../pages/types";

export function WorkshopBanner({
  page,
  activeIndex,
  onSelectIndex,
}: {
  page: PageContent;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}) {
  return (
    <>
      <div className="relative overflow-hidden bg-gray-100">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {page.cards.map((card) => (
            <div key={card.title} className="h-[430px] w-full shrink-0 sm:h-[560px]">
              <img className="h-full w-full object-cover" src={card.image} alt={card.title} />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/80">{page.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">{page.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">{page.description}</p>
          <a
            href="https://www.facebook.com/mejaicrafts"
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 no-underline transition hover:bg-neutral-100"
          >
            จองเวิร์คชอป
          </a>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {page.cards.map((card, index) => (
          <button
            type="button"
            key={card.title}
            onClick={() => onSelectIndex(index)}
            className={`h-2 rounded-full transition ${
              activeIndex === index ? "w-8 bg-gray-900" : "w-2 bg-gray-300"
            }`}
            aria-label={`ไปยังสไลด์ ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
