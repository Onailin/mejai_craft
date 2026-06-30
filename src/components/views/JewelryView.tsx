"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";
import { isDisplayableImageUrl, pickProductCoverImage } from "@/lib/image-urls";
import type { JewelryCategoryView, JewelryProductView } from "@/types";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes j-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes j-underline-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
`;

function toProductCard(product: JewelryProductView) {
  return {
    title: product.title,
    subtitle: product.subtitle,
    description: product.description,
    image: pickProductCoverImage(product.images) ?? "",
    accent: product.accent,
  };
}

function getShowcaseImages(product: JewelryProductView | undefined) {
  if (!product) return [];
  return product.images
    .filter((img) => isDisplayableImageUrl(img.imageUrl))
    .map((img) => ({
      image: img.imageUrl,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      accent: product.accent,
    }));
}

export function JewelryView({
  initialCategories,
  bannerSlides = [],
}: {
  initialCategories: JewelryCategoryView[];
  bannerSlides?: string[];
}) {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState(initialCategories[0]?.slug ?? "");
  const [activeRingImage, setActiveRingImage] = useState(0);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const locale = i18n.resolvedLanguage ?? "th";
    if (locale === "th") {
      setCategories(initialCategories);
      return;
    }
    fetch(`/api/content?type=jewelry&locale=${locale}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => setCategories(initialCategories));
  }, [i18n.resolvedLanguage, initialCategories]);

  useEffect(() => {
    setActiveRingImage(0);
  }, [activeCategory]);

  const selectedCategory = categories.find((c) => c.slug === activeCategory) ?? categories[0];
  const displayMode = selectedCategory?.displayMode ?? "GRID";
  const showcaseProduct = selectedCategory?.products[0];
  const showcaseImages = getShowcaseImages(showcaseProduct);

  if (!selectedCategory) {
    return <p className="px-6 text-sm text-stone-500">ยังไม่มีหมวดสินค้า</p>;
  }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <section className="jewelry-page-shell" style={{ paddingTop: 0 }}>
        {bannerSlides.length > 0 && (
        <div style={{ position: "relative", height: "clamp(220px, 38vw, 420px)", overflow: "hidden", background: "#f0f0ee" }}>
          <div style={{ display: "flex", height: "100%", transform: `translateX(-${activeBanner * 100}%)`, transition: "transform 0.6s ease" }}>
            {bannerSlides.map((src) => (
              <img key={src} src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", flexShrink: 0 }} />
            ))}
          </div>
        </div>
        )}

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", overflowX: "auto", borderBottom: "0.5px solid #e2e2e0" }}>
            {categories.map((tab) => {
              const isActive = tab.slug === activeCategory;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.slug)}
                  style={{
                    flexShrink: 0,
                    background: "none",
                    border: "none",
                    padding: "0 20px 14px",
                    cursor: "pointer",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: isActive ? "#111" : "#999",
                  }}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "28px 0 20px", borderBottom: "0.5px solid #e2e2e0", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic", fontSize: 28, fontWeight: 400, margin: 0 }}>
              {selectedCategory.name}
            </h2>
            <span style={{ fontSize: 10, letterSpacing: "0.25em", color: "#bbb", textTransform: "uppercase" }}>
              {t("jewelry.items_count", {
                count:
                  displayMode === "SHOWCASE"
                    ? showcaseImages.length
                    : selectedCategory.products.length,
              })}
            </span>
          </div>

          {displayMode === "SHOWCASE" && showcaseImages.length > 0 && showcaseProduct ? (
            <RingShowcase
              productId={showcaseProduct.id}
              images={showcaseImages}
              activeIndex={activeRingImage}
              onSelectImage={setActiveRingImage}
              t={t}
            />
          ) : displayMode === "IMAGE_ONLY" ? (
            <ImageOnlyGrid products={selectedCategory.products} categoryKey={selectedCategory.slug} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "40px 32px", paddingBottom: 64 }}>
              {selectedCategory.products.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="no-underline"
                  style={{ animation: `j-fade-up 0.4s ease ${i * 60}ms both` }}
                >
                  <ProductCard card={toProductCard(product)} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ImageOnlyGrid({
  products,
  categoryKey,
}: {
  products: JewelryProductView[];
  categoryKey: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 2 }}>
      {products.map((product) => {
        const image = product.images[0]?.imageUrl;
        if (!image) return null;
        return (
          <Link key={`${categoryKey}-${product.id}`} href={`/product/${product.id}`} className="no-underline">
            <figure style={{ margin: 0, overflow: "hidden", aspectRatio: "3/4" }}>
              <img src={image} alt={product.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </figure>
          </Link>
        );
      })}
    </div>
  );
}

function RingShowcase({
  productId,
  images,
  activeIndex,
  onSelectImage,
  t,
}: {
  productId: string;
  images: Array<{ image: string; title: string; subtitle: string; description: string; accent: string }>;
  activeIndex: number;
  onSelectImage: (index: number) => void;
  t: (k: string, o?: Record<string, unknown>) => string;
}) {
  const selected = images[activeIndex] ?? images[0];
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  return (
    <section style={{ maxWidth: 920, margin: "0 auto", paddingBottom: 64 }}>
      <figure style={{ margin: 0, overflow: "hidden", borderRadius: 14, background: "#f4f4f2", position: "relative" }}>
        <div style={{ display: "flex", transform: `translateX(-${activeIndex * 100}%)`, transition: "transform 0.45s ease" }}>
          {images.map((item) => (
            <img key={item.image} src={item.image} alt={item.title} style={{ width: "100%", aspectRatio: "5/4", objectFit: "cover", flexShrink: 0 }} />
          ))}
        </div>
        <button type="button" onClick={() => onSelectImage(activeIndex === 0 ? images.length - 1 : activeIndex - 1)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: 999, border: "1px solid rgba(255,255,255,0.75)", background: "rgba(0,0,0,0.3)", color: "#fff", cursor: "pointer" }}>‹</button>
        <button type="button" onClick={() => onSelectImage(activeIndex === images.length - 1 ? 0 : activeIndex + 1)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: 999, border: "1px solid rgba(255,255,255,0.75)", background: "rgba(0,0,0,0.3)", color: "#fff", cursor: "pointer" }}>›</button>
      </figure>
      <div style={{ display: "flex", overflowX: "auto", gap: 10, marginTop: 14 }}>
        {images.map((item, index) => (
          <button key={item.image} type="button" onClick={() => onSelectImage(index)} ref={(el) => { thumbnailRefs.current[index] = el; }} style={{ padding: 0, flex: "0 0 72px", width: 72, borderRadius: 10, overflow: "hidden", border: index === activeIndex ? "1.5px solid #111" : "1px solid #d8d8d8", cursor: "pointer" }}>
            <img src={item.image} alt={item.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
          </button>
        ))}
      </div>
      <article style={{ marginTop: 20 }}>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8b8b88" }}>{selected.subtitle}</p>
        <h3 style={{ margin: "10px 0", fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic", fontSize: 32 }}>{t("jewelry.ring_title")}</h3>
        <p style={{ color: "#5f5f5b", fontSize: 14, lineHeight: 1.65 }}>{selected.description}</p>
        <Link
          href={`/product/${productId}`}
          style={{ display: "inline-flex", marginTop: 16, borderRadius: 999, padding: "8px 14px", background: "#111", color: "#fff", textDecoration: "none", fontSize: 12 }}
        >
          {t("jewelry.buy_button")}
        </Link>
      </article>
    </section>
  );
}
