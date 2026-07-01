import type { PageContent } from "@/types";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE_FACEBOOK_URL, SITE_LINE_URL } from "@/lib/brand";
import { t } from "@/lib/copy";

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

export function AboutSection({
  page,
  settings,
}: {
  page: PageContent;
  settings?: {
    phone?: string;
    facebook_url?: string;
    line_url?: string;
    maps_url?: string;
    address?: string;
    brand_tagline?: string;
    studio_image_url?: string;
  };
}) {
  const phone = settings?.phone ?? "0888491111";
  const facebookUrl = settings?.facebook_url ?? SITE_FACEBOOK_URL;
  const lineUrl = settings?.line_url ?? SITE_LINE_URL;
  const tagline = settings?.brand_tagline?.trim() || t("about.tagline");
  const address = settings?.address ?? t("about.address_detail");
  const studioImageUrl = settings?.studio_image_url || page.cards[0]?.image || "";

  return (
    <section className="about-section">
      <style>{`
        .about-section {
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 2rem 6rem;
          color: #1a1a1a;
        }

        .about-header {
          text-align: center;
          margin-bottom: 5rem;
        }
        .about-eyebrow {
          display: inline-block;
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 1.25rem;
        }
        .about-title {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #0e0e0e;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }
        .about-title em {
          font-style: normal;
          font-weight: 500;
        }
        .about-rule {
          width: 40px;
          height: 1px;
          background: #c8c8c8;
          margin: 0 auto 1.75rem;
          border: none;
        }
        .about-intro {
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 14px;
          line-height: 2;
          color: #666;
          max-width: 480px;
          margin: 0 auto;
          letter-spacing: 0.01em;
          white-space: pre-line;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5px;
          background: #e0e0e0;
          border: 1px solid #e0e0e0;
          overflow: hidden;
        }

        .biz-card {
          background: #fff;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }
        .biz-top {
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .biz-brand {
          text-align: right;
        }
        .biz-brand-name {
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #111;
        }
        .biz-brand-sub {
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 8.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #aaa;
          margin-top: 3px;
        }

        .biz-info-label {
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 8.5px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 0.5rem;
        }
        .biz-contact-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        .social-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 9999px;
          padding: 0.55rem 0.9rem;
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          color: #fff;
          transition: opacity 0.18s;
        }
        .social-btn:hover {
          opacity: 0.9;
        }
        .social-btn-line {
          background: #06C755;
        }
        .social-btn-facebook {
          background: #1877F2;
        }
        .biz-info-title {
          font-size: 22px;
          font-weight: 400;
          color: #111;
          letter-spacing: -0.01em;
          margin-bottom: 0.35rem;
        }
        .biz-tagline {
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 12px;
          color: #999;
          line-height: 1.75;
          letter-spacing: 0.01em;
        }

        .biz-hr {
          border: none;
          border-top: 1px solid #f0f0f0;
          margin: 1.5rem 0;
        }

        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .contact-row {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #555;
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 12px;
          letter-spacing: 0.01em;
          transition: color 0.18s;
        }
        .contact-row:hover {
          color: #111;
        }
        .contact-row:hover .contact-icon {
          background: #111;
          border-color: #111;
          color: #fff;
        }
        .contact-icon {
          width: 30px;
          height: 30px;
          border: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #aaa;
          transition: all 0.18s;
        }

        .location-block {
          border-top: 1px solid #f0f0f0;
          padding-top: 1.5rem;
          margin-top: 1.75rem;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .location-icon {
          color: #ccc;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .location-label {
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 8.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 0.4rem;
        }
        .location-address {
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 11.5px;
          color: #888;
          line-height: 1.75;
        }
        .location-actions {
          margin-top: 1.25rem;
        }
        .dir-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 1rem;
          background: #111;
          color: #fff;
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 9.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 9px 18px;
          text-decoration: none;
          border: 1px solid #111;
          transition: background 0.18s, color 0.18s;
        }
        .dir-btn:hover {
          background: #fff;
          color: #111;
        }

        .photo-panel {
          background: #f4f4f2;
          position: relative;
          min-height: 500px;
          overflow: hidden;
        }
        .photo-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: absolute;
          inset: 0;
        }
        .photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.32) 100%);
        }
        .photo-caption {
          position: absolute;
          bottom: 1.5rem;
          left: 2rem;
          right: 2rem;
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }
        .photo-number {
          position: absolute;
          top: 1.75rem;
          right: 1.75rem;
          font-family: 'Prompt', 'Noto Sans Thai', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.5);
        }

        @media (max-width: 700px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
          .photo-panel {
            min-height: 280px;
          }
          .biz-card {
            padding: 2rem;
          }
          .about-section {
            padding: 3.5rem 1.25rem 4rem;
          }
        }
      `}</style>

      <header className="about-header">
        <span className="about-eyebrow">{page.eyebrow}</span>
        <h1 className="about-title">
          {page.title.split(" ").map((word: string, i: number) =>
            i % 2 === 1 ? <em key={i}> {word}</em> : <span key={i}>{word}</span>
          )}
        </h1>
        <hr className="about-rule" />
        <p className="about-intro">{page.description}</p>
      </header>

      <div className="about-grid">
        <article className="biz-card">
          <div className="biz-top">
            <div className="biz-brand">
              <p className="biz-brand-name">Mejai</p>
              <p className="biz-brand-sub">Jewelry Craft</p>
            </div>
          </div>

          <div className="biz-contact-head">
            <div>
              <p className="biz-info-label">{t("about.business_card")}</p>
              <h2 className="biz-info-title">{t("about.contact_title")}</h2>
            </div>
            <div className="social-actions">
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn social-btn-line"
              >
                <LineIcon className="h-3.5 w-3.5 shrink-0" />
                LINE
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn social-btn-facebook"
              >
                <FacebookIcon className="h-3.5 w-3.5 shrink-0" />
                Facebook
              </a>
            </div>
          </div>
          <p className="biz-tagline">{tagline}</p>

          <hr className="biz-hr" />

          <div className="contact-list">
            <a href={`tel:${phone.replace(/-/g, "")}`} className="contact-row">
              <span className="contact-icon"><Phone size={13} /></span>
              {phone}
            </a>
            <a href="mailto:Mejaistudioandgallery@gmail.com" className="contact-row">
              <span className="contact-icon"><Mail size={13} /></span>
              Mejaistudioandgallery@gmail.com
            </a>
          </div>

          <div className="location-block">
            <span className="location-icon"><MapPin size={15} /></span>
            <div>
              <p className="location-label">{t("about.studio_location")}</p>
              <p className="location-address">{address}</p>
              <div className="location-actions">
                <a
                  href="https://maps.app.goo.gl/A1WeSNCQxHUZDJmN6"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-medium text-white no-underline transition hover:bg-neutral-700"
                >
                  {t("about.get_directions")}
                </a>
              </div>
            </div>
          </div>
        </article>

        {studioImageUrl ? (
        <div className="photo-panel">
          <img src={studioImageUrl} alt="Mejai Studio" />
          <div className="photo-overlay" />
          <span className="photo-number">01 / Studio</span>
          <p className="photo-caption">{t("about.photo_caption")}</p>
        </div>
        ) : null}
      </div>
    </section>
  );
}