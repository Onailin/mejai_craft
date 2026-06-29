"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SITE_LINE_URL } from "@/lib/brand";
import type { JewelryProductView } from "@/types";
function formatPrice(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

type ProductDetailProps = {
  product: JewelryProductView;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const images = product.images.length > 0 ? product.images : [{ imageUrl: "", isPrimary: true }];
  const [activeImage, setActiveImage] = useState(
    images.findIndex((image) => image.isPrimary) >= 0
      ? images.findIndex((image) => image.isPrimary)
      : 0
  );

  const currentImage = images[activeImage]?.imageUrl;

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 font-sans text-stone-900 sm:px-6">
      <Link
        href="/jewelry"
        className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับไปหน้าสินค้า
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
            {currentImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentImage}
                alt={product.title}
                className="block h-auto w-full"
              />
            ) : (
              <div className="flex min-h-[240px] items-center justify-center text-sm text-stone-400">
                ไม่มีรูปภาพ
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={`${image.imageUrl}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`flex h-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-stone-50 px-1 transition ${
                    activeImage === index ? "border-stone-900" : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {image.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.imageUrl}
                      alt=""
                      className="max-h-16 max-w-16 object-contain"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="mb-3 inline-flex w-fit rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
            {product.categoryName}
          </span>

          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>

          {product.subtitle && (
            <p className="mt-2 text-base text-stone-500">{product.subtitle}</p>
          )}

          <div className="mt-6 border-y border-stone-200 py-6">
            {product.price != null ? (
              <p className="text-3xl font-semibold tracking-tight">{formatPrice(product.price)}</p>
            ) : (
              <p className="text-lg font-medium text-stone-600">สอบถามราคา</p>
            )}
            {product.accent && (
              <p className="mt-2 text-sm text-stone-500">{product.accent}</p>
            )}
          </div>

          {product.description && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
                รายละเอียด
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700 sm:text-base">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={SITE_LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-sm font-medium text-white no-underline transition hover:bg-[#05b34c]"
            >
              สอบถาม / สั่งซื้อทาง LINE
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 px-6 py-3 text-sm font-medium text-stone-700 no-underline transition hover:bg-stone-50"
            >
              ข้อมูลติดต่อร้าน
            </Link>
          </div>        </div>
      </div>
    </div>
  );
}
