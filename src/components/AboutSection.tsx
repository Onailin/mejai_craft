import { STORE } from "../data/gems";
import type { PageContent } from "../pages/types";

export function AboutSection({ page }: { page: PageContent }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

      {/* Top: Title + Description */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
          {page.eyebrow}
        </p>

        <h1 className="mt-3 font-serif text-4xl font-light text-stone-800 sm:text-5xl">
          เกี่ยวกับเรา
        </h1>

        <p className="mt-6 whitespace-pre-line text-lg leading-9 text-stone-600 sm:text-xl">
          {"จากรุ่นสู่รุ่น เสน่ห์ของงานฝีมือและคุณค่าของอัญมณีแท้\nทุกชิ้นงานจึงไม่ใช่เพียงเครื่องประดับ แต่เป็นเรื่องราวและความทรงจำจากเมืองแห่งอัญมณี จันทบุรี"}
        </p>
      </div>



      {/* Main Content (Business Card + Side Photo) */}
      <div className="mt-20 grid items-stretch gap-12 lg:grid-cols-2 lg:gap-16">

        {/* Left : Business Card */}
        <article className="relative h-full overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

          {/* Subtle gradient base */}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#ffffff_0%,#f7f7f5_35%,#ffffff_60%,#f2f2ef_100%)]" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_22%_18%,rgba(150,150,150,0.18)_0,transparent_40%),radial-gradient(circle_at_78%_74%,rgba(150,150,150,0.15)_0,transparent_35%)]" />

          {/* QR + Title */}
          <div className="relative flex items-start justify-between">
            <img
              src="/images/qrcode/qrcode.jpg"
              alt="QR Code"
              className="h-20 w-20 rounded-xl border border-stone-200 bg-white p-1 shadow-sm"
            />

            <div className="text-right leading-tight text-stone-400">
              <p className="text-sm font-semibold tracking-[0.22em]">Mejai</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em]">Jewelry Craft</p>
            </div>
          </div>

          {/* Info */}
          <div className="relative mt-6 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400">
              Business Card
            </p>

            <h2 className="font-serif text-2xl text-stone-800">{STORE.nameTh}</h2>
            <p className="text-sm text-stone-500">{STORE.tagline}</p>

            {/* Contact */}
            <div className="mt-4 grid gap-2">
              <a
                href={`tel:${STORE.phone.replace(/-/g, "")}`}
                className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100">
                  ☎
                </span>
                {STORE.phone}
              </a>

              <a
                href="https://www.facebook.com/mejaicrafts"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100">
                  f
                </span>
                MEJAI Crafts - มีใจ คราฟต์
              </a>

              <a
                href="mailto:Mejaistudioandgallery@gmail.com"
                className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100">
                  @
                </span>
                Mejaistudioandgallery@gmail.com
              </a>
            </div>
          </div>
        </article>

        {/* Right : Photo Block (เพิ่มให้ section ดูเต็มขึ้น) */}
        <div className="relative hidden h-full w-full overflow-hidden rounded-3xl bg-stone-100 shadow-sm lg:block">
          <img
            src="/images/banner/banner4.jpg"
            alt="Store photo"
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-4 right-4 rounded-lg bg-white/70 px-4 py-2 text-xs tracking-wide text-stone-700 backdrop-blur">
            มีใจ คราฟต์ จิวเวลรี่ · จันทบุรี
          </div>
        </div>
      </div>
    </section>
  );
}
