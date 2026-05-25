import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { defaultPageId, getHashPage, pages } from "./pages/content";
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

export function App() {
  const { i18n, t } = useTranslation();
  const [activePageId, setActivePageId] = useState<PageKey>(() => getHashPage());
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
    const syncHash = () => setActivePageId(getHashPage());
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

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

  return (
    <div className="min-h-dvh overflow-hidden bg-[#f7f7f5] font-sans text-luxury-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0,transparent_45%)]" />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <a href={`#${defaultPageId}`} className="flex items-center gap-3 text-luxury-ink no-underline">
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
              className="flex gap-2 overflow-x-auto pb-1 text-sm lg:justify-end lg:overflow-visible lg:pb-0"
              aria-label="หมวดสินค้า"
            >
              {navPages.map((page) => {
                const isActive = page.id === activePage.id;
                return (
                  <a
                    key={page.id}
                    href={`#${page.id}`}
                    className={`shrink-0 rounded-full border px-4 py-2 no-underline transition ${
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
