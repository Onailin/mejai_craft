import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ProductCard } from "../../components/ProductCard";
import {
  jewelryCatalog,
  jewelryCategoryTabs,
  type JewelryCategoryKey,
} from "../../data/jewelryCatalog";
import type { PageContent } from "../types";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes j-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes j-underline-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  @media (max-width: 768px) {
    .jewelry-page-shell {
      padding-top: 92px !important;
    }
  }
`;

// ─── Tab bar ──────────────────────────────────────────────────────────────────
// Splits tabs into two rows if too many for one line
function CategoryTabs({
  tabs,
  active,
  onSelect,
  t,
}: {
  tabs: typeof jewelryCategoryTabs;
  active: JewelryCategoryKey;
  onSelect: (id: JewelryCategoryKey) => void;
  t: (k: string, o?: Record<string, unknown>) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        flexWrap: "nowrap",
        gap: "0",
        overflowX: "auto",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        borderBottom: "0.5px solid #e2e2e0",
        position: "relative",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id as JewelryCategoryKey)}
            style={{
              flexShrink: 0,
              position: "relative",
              background: "none",
              border: "none",
              padding: "0 20px 14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: isActive ? 500 : 300,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isActive ? "#111" : "#999",
              transition: "color 0.22s",
              whiteSpace: "nowrap",
            }}
          >
            {t(`jewelry.tab.${tab.id}`, { defaultValue: tab.label })}

            {/* Active underline */}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  bottom: "-0.5px",
                  left: "20px",
                  right: "20px",
                  height: "1px",
                  background: "#111",
                  transformOrigin: "left",
                  animation: "j-underline-grow 0.28s cubic-bezier(0.4,0,0.2,1) forwards",
                  display: "block",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ label, count }: { label: string; count: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "28px 0 20px",
        borderBottom: "0.5px solid #e2e2e0",
        marginBottom: "32px",
      }}
    >
      <h2
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(22px, 3vw, 30px)",
          fontWeight: 400,
          color: "#111",
          lineHeight: 1,
        }}
      >
        {label}
      </h2>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.25em",
          color: "#bbb",
          textTransform: "uppercase",
        }}
      >
        {count} items
      </span>
    </div>
  );
}

// ─── Image-only grid (souvenir-pen) ──────────────────────────────────────────
function ImageOnlyGrid({
  cards,
  categoryKey,
}: {
  cards: (typeof jewelryCatalog)[JewelryCategoryKey];
  categoryKey: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "2px",
      }}
    >
      {cards.map((card, i) => (
        <figure
          key={`${categoryKey}-${i}`}
          style={{
            margin: 0,
            overflow: "hidden",
            aspectRatio: "3/4",
            animation: `j-fade-up 0.4s ease ${i * 60}ms both`,
          }}
        >
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
            }}
          />
        </figure>
      ))}
    </div>
  );
}

// ─── Product grid ─────────────────────────────────────────────────────────────
function ProductGrid({
  cards,
  categoryKey,
}: {
  cards: (typeof jewelryCatalog)[JewelryCategoryKey];
  categoryKey: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "40px 32px",
        paddingBottom: "64px",
      }}
    >
      {cards.map((card, i) => (
        <div
          key={`${categoryKey}-${card.title}`}
          style={{
            animation: `j-fade-up 0.4s ease ${i * 60}ms both`,
          }}
        >
          <ProductCard card={card} />
        </div>
      ))}
    </div>
  );
}

// ─── Ring showcase (single product style) ─────────────────────────────────────
function RingShowcase({
  cards,
  activeIndex,
  onSelectImage,
}: {
  cards: (typeof jewelryCatalog)["ring"];
  activeIndex: number;
  onSelectImage: (index: number) => void;
}) {
  const selected = cards[activeIndex] ?? cards[0];
  const totalImages = cards.length;
  const thumbnailTrackRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const activeThumb = thumbnailRefs.current[activeIndex];
    if (!activeThumb) return;
    activeThumb.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  function handlePrevImage() {
    onSelectImage(activeIndex === 0 ? totalImages - 1 : activeIndex - 1);
  }

  function handleNextImage() {
    onSelectImage(activeIndex === totalImages - 1 ? 0 : activeIndex + 1);
  }

  return (
    <section
      style={{
        maxWidth: "920px",
        margin: "0 auto",
        paddingBottom: "64px",
      }}
    >
      <figure
        style={{
          margin: 0,
          overflow: "hidden",
          borderRadius: "14px",
          background: "#f4f4f2",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: "transform 0.45s ease",
          }}
        >
          {cards.map((card) => (
            <img
              key={card.image}
              src={card.image}
              alt={card.title}
              style={{
                width: "100%",
                aspectRatio: "5/4",
                objectFit: "cover",
                display: "block",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handlePrevImage}
          aria-label="รูปก่อนหน้า"
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.75)",
            background: "rgba(0,0,0,0.3)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ‹
        </button>

        <button
          type="button"
          onClick={handleNextImage}
          aria-label="รูปถัดไป"
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.75)",
            background: "rgba(0,0,0,0.3)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ›
        </button>
      </figure>

      <div
        ref={thumbnailTrackRef}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x proximity",
          gap: "10px",
          marginTop: "14px",
          paddingBottom: "4px",
        }}
      >
        {cards.map((card, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={card.image}
              type="button"
              onClick={() => onSelectImage(index)}
              ref={(el) => {
                thumbnailRefs.current[index] = el;
              }}
              aria-label={`ดูรูปสินค้า ${index + 1}`}
              style={{
                padding: 0,
                flex: "0 0 72px",
                width: "72px",
                borderRadius: "10px",
                overflow: "hidden",
                border: isActive ? "1.5px solid #111" : "1px solid #d8d8d8",
                cursor: "pointer",
                background: "#fff",
                scrollSnapAlign: "center",
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  display: "block",
                  opacity: isActive ? 1 : 0.82,
                }}
              />
            </button>
          );
        })}
      </div>

      <article
        style={{
          marginTop: "20px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8b8b88",
          }}
        >
          {selected.subtitle}
        </p>
        <div
          style={{
            margin: "10px 0 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(26px, 3vw, 36px)",
              lineHeight: 1.12,
              color: "#111",
            }}
          >
            แหวนเงิน
          </h3>

          <a
            href="https://www.facebook.com/mejaicrafts"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              padding: "8px 14px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textDecoration: "none",
              background: "#111",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            🛒 สั่งซื้อ
          </a>
        </div>
        <p
          style={{
            margin: "0 0 18px",
            color: "#5f5f5b",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            lineHeight: 1.65,
          }}
        >
          {selected.description}
        </p>
        <p
          style={{
            margin: "0 0 22px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: "#8f8f8b",
          }}
        >
          {selected.accent}
        </p>
      </article>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function JewelryPage({ page }: { page: PageContent }) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] =
    useState<JewelryCategoryKey>("ring");
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeRingImage, setActiveRingImage] = useState(0);
  const bannerSlides = ["/images/banner/banner18.jpg", "/images/banner/banner19.jpg","/images/banner/banner20.jpg"];

  const selectedCards = jewelryCatalog[activeCategory];
  const isRingCategory = activeCategory === "ring";
  const isImageOnly   = activeCategory === "souvenir-pen";

  const categoryLabel =
    activeCategory === "ring"
      ? t("jewelry.ring_collection_heading", { defaultValue: "Silver Ring Collection" })
      : t(`jewelry.tab.${activeCategory}`, { defaultValue: activeCategory });

  function handleSelect(id: JewelryCategoryKey) {
    if (id === activeCategory) return;
    setActiveCategory(id);
  }

  function handlePrevBanner() {
    setActiveBanner((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  }

  function handleNextBanner() {
    setActiveBanner((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
  }

  useEffect(() => {
    setActiveRingImage(0);
  }, [activeCategory]);

  return (
    <>
      <style>{KEYFRAMES}</style>

      <section
        className="jewelry-page-shell"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        <div
          style={{
            marginBottom: "28px",
            overflow: "hidden",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            background: "#f5f5f5",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              transform: `translateX(-${activeBanner * 100}%)`,
              transition: "transform 0.55s ease",
            }}
          >
            {bannerSlides.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`${page.title} banner ${index + 1}`}
                style={{
                  width: "100%",
                  height: "clamp(320px, 52vw, 620px)",
                  objectFit: "cover",
                  display: "block",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.48) 100%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "clamp(16px, 3vw, 36px)",
              right: "clamp(16px, 3vw, 36px)",
              bottom: "clamp(18px, 4vw, 42px)",
              color: "#fff",
              zIndex: 1,
              pointerEvents: "none",
              maxWidth: "min(620px, 100%)",
              animation: "j-fade-up 0.45s ease both",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(10px, 1.3vw, 12px)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              {page.eyebrow}
            </p>
            <h1
              style={{
                margin: "8px 0 0",
                fontFamily: "'EB Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "clamp(28px, 5vw, 56px)",
                lineHeight: 1.05,
              }}
            >
              {page.title}
            </h1>
            <a
              href="https://www.facebook.com/mejaicrafts"
              target="_blank"
              rel="noreferrer"
              style={{
                pointerEvents: "auto",
                display: "inline-flex",
                marginTop: "14px",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 18px",
                borderRadius: 999,
                background: "#fff",
                color: "#111",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              สอบถามเพิ่มเติม
            </a>
          </div>

          <button
            type="button"
            onClick={handlePrevBanner}
            aria-label="Previous banner"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              border: "1px solid rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.25)",
              color: "#fff",
              borderRadius: 999,
              width: 34,
              height: 34,
              cursor: "pointer",
            }}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={handleNextBanner}
            aria-label="Next banner"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              border: "1px solid rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.25)",
              color: "#fff",
              borderRadius: 999,
              width: 34,
              height: 34,
              cursor: "pointer",
            }}
          >
            ›
          </button>

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 10,
              transform: "translateX(-50%)",
              display: "flex",
              gap: 6,
            }}
          >
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveBanner(index)}
                aria-label={`Go to banner ${index + 1}`}
                style={{
                  width: index === activeBanner ? 20 : 8,
                  height: 8,
                  borderRadius: 999,
                  border: "none",
                  background: index === activeBanner ? "#fff" : "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Tab navigation ── */}
        <CategoryTabs
          tabs={jewelryCategoryTabs}
          active={activeCategory}
          onSelect={handleSelect}
          t={t}
        />

        {/* ── Heading row ── */}
        <SectionHeading label={categoryLabel} count={isRingCategory ? 1 : selectedCards.length} />

        {/* ── Content ── */}
        {isRingCategory ? (
          <RingShowcase
            cards={jewelryCatalog.ring}
            activeIndex={activeRingImage}
            onSelectImage={setActiveRingImage}
          />
        ) : isImageOnly ? (
          <ImageOnlyGrid cards={selectedCards} categoryKey={activeCategory} />
        ) : (
          <ProductGrid cards={selectedCards} categoryKey={activeCategory} />
        )}
      </section>
    </>
  );
}