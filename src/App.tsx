import { useEffect, useMemo, useState } from "react";
import { defaultPageId, getHashPage, pages } from "./pages/content";
import type { PageContent, PageKey } from "./pages/types";
import { AboutPage } from "./pages/views/AboutPage";
import { HomePage } from "./pages/views/HomePage";
import { JewelryPage } from "./pages/views/JewelryPage";
import { WorkshopPage } from "./pages/views/WorkshopPage";

function renderPage(page: PageContent) {
  switch (page.id) {
    case "home":
      return <HomePage page={page} />;
    case "about":
      return <AboutPage page={page} />;
    case "workshop":
      return <WorkshopPage page={page} />;
    case "jewelry":
      return <JewelryPage page={page} />;
    default:
      return <HomePage page={page} />;
  }
}

export function App() {
  const [activePageId, setActivePageId] = useState<PageKey>(() => getHashPage());

  useEffect(() => {
    const syncHash = () => setActivePageId(getHashPage());
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId]
  );
  const isHome = activePage.id === "home";
  const isAbout = activePage.id === "about";
  const isWorkshop = activePage.id === "workshop";

  return (
    <div className="min-h-dvh overflow-hidden bg-[#f7f7f5] font-sans text-luxury-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0,transparent_45%)]" />

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <a href={`#${defaultPageId}`} className="flex items-center gap-3 text-luxury-ink no-underline">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-gray-50 font-sans text-base text-gray-700">
              M
            </span>
            <span>
              <span className="block font-sans text-xl font-semibold tracking-wide">
                Mejai Craft
              </span>
              <span className="block text-xs uppercase tracking-[0.28em] text-luxury-muted">
                Jewelry Design and Exhibition
              </span>
            </span>
          </a>

          <nav
            className="flex gap-2 overflow-x-auto pb-1 text-sm lg:justify-end lg:overflow-visible lg:pb-0"
            aria-label="หมวดสินค้า"
          >
            {pages.map((page) => {
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
      </header>

      <main
        className={
          isHome || isAbout || isWorkshop
            ? "relative z-10 pb-14"
            : "relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-8"
        }
      >
        {renderPage(activePage)}
      </main>

      <footer className="relative z-10 border-t border-gray-200 bg-white/55 px-4 py-8 text-center text-sm text-luxury-muted">
        © Mejai Craft · Luxury gemstone and jewelry information
      </footer>
    </div>
  );
}
