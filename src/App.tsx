import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { defaultPageId, getCurrentPage, getPagePath, pages } from "./pages/content";
import type { PageContent, PageKey } from "./pages/types";
import { AboutPage } from "./pages/views/AboutPage";
import { ContactPage } from "./pages/views/ContactPage";
import { HomePage } from "./pages/views/HomePage";
import { JewelryPage } from "./pages/views/JewelryPage";
import { WorkshopPage } from "./pages/views/WorkshopPage";

function renderPage(page: PageContent) {
  switch (page.id) {
    case "home":
      return <HomePage page={page} />;
    case "about":
      return <AboutPage page={page} />;
    case "contact":
      return <ContactPage page={page} />;
    case "workshop":
      return <WorkshopPage page={page} />;
    case "jewelry":
      return <JewelryPage page={page} />;
    default:
      return <HomePage page={page} />;
  }
}

const SITE_URL = "https://mejaicrafts.com";
const DEFAULT_DESCRIPTION =
  "Mejai Crafts ร้านจิวเวลรี่และเวิร์คช็อปในจันทบุรี รวมข้อมูลอัญมณี เครื่องประดับ และบริการสั่งทำ";

function upsertMetaTag(attr: "name" | "property", key: string, content: string) {
  let meta = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
}

export function App() {
  const { i18n, t } = useTranslation();
  const [activePageId, setActivePageId] = useState<PageKey>(() => getCurrentPage());
  const getNavLabel = (pageId: PageKey, fallback: string) => {
    switch (pageId) {
      case "home":
        return t("nav_home");
      case "about":
        return t("nav_about");
      case "contact":
        return t("nav_contact");
      case "jewelry":
        return t("nav_jewelry");
      case "workshop":
        return t("nav_workshop");
      default:
        return fallback;
    }
  };

  useEffect(() => {
    const syncPath = () => setActivePageId(getCurrentPage());
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => {
    if (activePageId === "jewelry") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activePageId]);

  const localizedPages = useMemo(
    () =>
      pages.map((page) => ({
        ...page,
        navLabel: getNavLabel(page.id, page.navLabel),
        title: t(`page.${page.id}.title`, { defaultValue: page.title }),
        eyebrow: t(`page.${page.id}.eyebrow`, { defaultValue: page.eyebrow }),
        description: t(`page.${page.id}.description`, { defaultValue: page.description }),
        cards: page.cards.map((card, index) => ({
          ...card,
          title: t(`page.${page.id}.cards.${index}.title`, { defaultValue: card.title }),
          subtitle: t(`page.${page.id}.cards.${index}.subtitle`, { defaultValue: card.subtitle }),
          description: t(`page.${page.id}.cards.${index}.description`, {
            defaultValue: card.description,
          }),
          accent: t(`page.${page.id}.cards.${index}.accent`, { defaultValue: card.accent }),
        })),
      })),
    [t, i18n.resolvedLanguage]
  );
  const navPages = useMemo(() => {
    const orderedNavIds: PageKey[] = ["home", "jewelry", "workshop", "about", "contact"];
    return orderedNavIds
      .map((id) => localizedPages.find((page) => page.id === id))
      .filter((page): page is PageContent => Boolean(page));
  }, [localizedPages]);

  const activePage = useMemo(
    () => localizedPages.find((page) => page.id === activePageId) ?? localizedPages[0],
    [activePageId, localizedPages]
  );

  useEffect(() => {
    const pageTitle = activePage.id === "home" ? "Mejai Crafts" : activePage.navLabel;
    const title = `${pageTitle} | Mejai Crafts`;
    const description = activePage.description || DEFAULT_DESCRIPTION;
    const pageUrl = `${SITE_URL}${getPagePath(activePage.id)}`;
    const firstImage = activePage.cards[0]?.image || "/images/banner/home.jpg";
    const imageUrl = firstImage.startsWith("http") ? firstImage : `${SITE_URL}${firstImage}`;

    document.title = title;
    document.documentElement.lang = i18n.resolvedLanguage?.startsWith("th") ? "th" : "en";

    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "robots", "index, follow");
    upsertMetaTag("property", "og:type", "website");
    upsertMetaTag("property", "og:site_name", "Mejai Crafts");
    upsertMetaTag("property", "og:title", title);
    upsertMetaTag("property", "og:description", description);
    upsertMetaTag("property", "og:url", pageUrl);
    upsertMetaTag("property", "og:image", imageUrl);
    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", title);
    upsertMetaTag("name", "twitter:description", description);
    upsertMetaTag("name", "twitter:image", imageUrl);
    upsertCanonical(pageUrl);
  }, [activePage, i18n.resolvedLanguage]);

  const isHome = activePage.id === "home";
  const isAbout = activePage.id === "about";
  const isContact = activePage.id === "contact";
  const isWorkshop = activePage.id === "workshop";
  const languageButtons = [
    { code: "th", label: "TH" },
    { code: "en", label: "EN" },
    { code: "zh", label: "中文" },
    { code: "ja", label: "JP" },
  ] as const;

  function handleNavigate(event: ReactMouseEvent<HTMLAnchorElement>, pageId: PageKey) {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    const nextPath = getPagePath(pageId);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setActivePageId(pageId);
  }

  return (
    <div className="min-h-dvh overflow-hidden bg-[#f7f7f5] font-sans text-luxury-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0,transparent_45%)]" />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <a
            href={getPagePath(defaultPageId)}
            onClick={(event) => handleNavigate(event, defaultPageId)}
            className="flex items-center gap-3 text-luxury-ink no-underline"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-gray-50 font-sans text-base text-gray-700">
              M
            </span>
            <span>
              <span className="block font-sans text-xl font-semibold tracking-wide">
                {t("app.brand_name")}
              </span>
              <span className="block text-xs uppercase tracking-[0.28em] text-luxury-muted">
                {t("app.brand_tagline")}
              </span>
            </span>
          </a>

          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex items-center gap-2">
              {languageButtons.map((lang) => {
                const isActiveLang = i18n.resolvedLanguage?.startsWith(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      isActiveLang
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>

            <nav
              className="flex gap-1.5 overflow-x-auto pb-1 text-xs lg:justify-end lg:gap-2 lg:overflow-visible lg:pb-0 lg:text-sm"
              aria-label="หมวดสินค้า"
            >
              {navPages.map((page) => {
                const isActive = page.id === activePage.id;
                return (
                  <a
                    key={page.id}
                    href={getPagePath(page.id)}
                    onClick={(event) => handleNavigate(event, page.id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 no-underline transition sm:px-4 sm:py-2 ${
                      isActive
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-luxury-ink hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page.navLabel}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main
        className={
          isAbout || isContact
            ? "relative z-10 pb-14 pt-32"
            : isHome || isWorkshop
            ? "relative z-10 pb-14 pt-24"
            : "relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 lg:px-8"
        }
      >
        {renderPage(activePage)}
      </main>

      <footer className="relative z-10 border-t border-gray-200 bg-white/55 px-4 py-8 text-center text-sm text-luxury-muted">
        {t("app.footer")}
      </footer>
    </div>
  );
}
