import { STORE } from "../data/gems";
import type { PageContent } from "../pages/types";
import { useTranslation } from "react-i18next";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

export function AboutSection({ page }: { page: PageContent }) {
  const { t } = useTranslation();

  return (
    <section className="about-section">
      <style>{`
        .about-section {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
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
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 1.25rem;
        }
        .about-title {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #0e0e0e;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }
        .about-title em {
          font-style: italic;
          font-weight: 300;
        }
        .about-rule {
          width: 40px;
          height: 1px;
          background: #c8c8c8;
          margin: 0 auto 1.75rem;
          border: none;
        }
        .about-intro {
          font-family: 'Helvetica Neue', Arial, sans-serif;
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
        .biz-qr {
          width: 48px;
          height: 48px;
          border: 1px solid #e8e8e8;
          padding: 4px;
          background: #fff;
          flex-shrink: 0;
        }
        .biz-qr img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .biz-brand {
          text-align: right;
        }
        .biz-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #111;
        }
        .biz-brand-sub {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 8.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #aaa;
          margin-top: 3px;
        }

        .biz-info-label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
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
        .biz-qr-large {
          width: 84px;
          height: 84px;
          border: 1px solid #e8e8e8;
          padding: 5px;
          background: #fff;
          flex-shrink: 0;
        }
        .biz-qr-large img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .biz-info-title {
          font-size: 22px;
          font-weight: 400;
          color: #111;
          letter-spacing: -0.01em;
          margin-bottom: 0.35rem;
        }
        .biz-tagline {
          font-family: 'Helvetica Neue', Arial, sans-serif;
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
          font-family: 'Helvetica Neue', Arial, sans-serif;
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
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 8.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 0.4rem;
        }
        .location-address {
          font-family: 'Helvetica Neue', Arial, sans-serif;
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
          font-family: 'Helvetica Neue', Arial, sans-serif;
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
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }
        .photo-number {
          position: absolute;
          top: 1.75rem;
          right: 1.75rem;
          font-family: 'Cormorant Garamond', serif;
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
            <div className="biz-qr-large">
              <img src="/images/qrcode/qrcode.jpg" alt="QR Code" />
            </div>
          </div>
          <p className="biz-tagline">{t("about.tagline")}</p>

          <hr className="biz-hr" />

          <div className="contact-list">
            <a href={`tel:${STORE.phone.replace(/-/g, "")}`} className="contact-row">
              <span className="contact-icon"><Phone size={13} /></span>
              {STORE.phone}
            </a>
            <a
              href="https://www.facebook.com/mejaicrafts"
              target="_blank"
              rel="noreferrer"
              className="contact-row"
            >
              <span className="contact-icon"><Globe size={13} /></span>
              {t("about.facebook_label")}
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
              <p className="location-address">{t("about.address_detail")}</p>
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

        <div className="photo-panel">
          <img src="/images/banner/banner4.jpg" alt="Mejai Studio" />
          <div className="photo-overlay" />
          <span className="photo-number">01 / Studio</span>
          <p className="photo-caption">{t("about.photo_caption")}</p>
        </div>
      </div>
    </section>
  );
}