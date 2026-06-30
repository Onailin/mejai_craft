"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SITE_FACEBOOK_URL, SITE_LINE_URL } from "@/lib/brand";
import { getDisplayableProductImages } from "@/lib/image-urls";
import type { JewelryProductView } from "@/types";

function formatPrice(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

type ProductDetailProps = {
  product: JewelryProductView;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const images = useMemo(
    () => getDisplayableProductImages(product.images),
    [product.images]
  );
  const [activeImage, setActiveImage] = useState(0);
  const currentImage = images[activeImage]?.imageUrl;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-2 font-sans text-stone-900 sm:px-8 lg:px-10">
      <Link
        href="/jewelry"
        className="mb-8 inline-flex items-center gap-2 text-base text-stone-500 transition hover:text-stone-900"
      >
        <ArrowLeft className="h-5 w-5" />
        กลับไปหน้าสินค้า
      </Link>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:items-start">
        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-2xl bg-stone-100">
            {currentImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentImage}
                alt={product.title}
                className="mx-auto block max-h-[min(72vh,640px)] w-full object-contain p-4 sm:p-6"
              />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center text-base text-stone-400 sm:min-h-[420px]">
                ไม่มีรูปภาพ
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={`${image.imageUrl}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`ดูรูปที่ ${index + 1}`}
                  className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-50 p-2 transition ${
                    activeImage === index
                      ? "ring-2 ring-stone-900 ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-10">
          <header className="space-y-4">
            <p className="text-sm font-medium text-stone-500">{product.categoryName}</p>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                {product.title}
              </h1>
              {product.subtitle ? (
                <p className="text-lg text-stone-500 sm:text-xl">{product.subtitle}</p>
              ) : null}
            </div>

            <div className="pt-2">
              {product.price != null ? (
                <p className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
                  {formatPrice(product.price)}
                </p>
              ) : (
                <p className="text-2xl font-semibold text-stone-700 sm:text-3xl">สอบถามราคา</p>
              )}
              {product.accent ? (
                <p className="mt-3 text-base text-stone-500 sm:text-lg">{product.accent}</p>
              ) : null}
            </div>
          </header>

          {product.description ? (
            <section className="space-y-4 border-t border-stone-200 pt-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                รายละเอียดสินค้า
              </h2>
              <p className="whitespace-pre-line text-lg leading-[1.85] text-stone-700 sm:text-xl sm:leading-[1.9]">
                {product.description}
              </p>
            </section>
          ) : null}

          <section className="space-y-5 border-t border-stone-200 pt-8">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                สอบถาม / สั่งซื้อ
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                ติดต่อทาง LINE หรือ Facebook เพื่อสอบถามรายละเอียด ขนาด วัสดุ และสั่งทำสินค้า
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={SITE_LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#06C755] px-4 py-2.5 text-sm font-medium text-white no-underline transition hover:bg-[#05b34c]"
              >
                <LineIcon className="h-4 w-4 shrink-0" />
                สั่งซื้อทาง LINE
              </a>
              <a
                href={SITE_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2.5 text-sm font-medium text-white no-underline transition hover:bg-[#166fe0]"
              >
                <FacebookIcon className="h-4 w-4 shrink-0" />
                Facebook
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
