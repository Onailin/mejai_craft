"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AdminAuthButton } from "@/components/layout/AdminAuthButton";

const navPages = [
  { id: "jewelry", href: "/jewelry", labelKey: "nav_jewelry" },
  { id: "workshop", href: "/workshop", labelKey: "nav_workshop" },
  { id: "about", href: "/about", labelKey: "nav_about" },
  { id: "contact", href: "/contact", labelKey: "nav_contact" },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isAbout = pathname === "/about";
  const isContact = pathname === "/contact";
  const isHome = pathname === "/";
  const isWorkshop = pathname === "/workshop";
  const isJewelry = pathname === "/jewelry";

  return (
    <div className="min-h-dvh bg-[#f7f7f5] font-sans text-luxury-ink">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,#ffffff_0,transparent_45%)]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm shadow-gray-900/[0.03] backdrop-blur-xl">
        <div className="mx-auto flex h-28 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="relative z-50 shrink-0 no-underline">
            <BrandLogo size="lg" />
          </Link>

          <div className="relative z-50 flex shrink-0 items-center gap-2 sm:gap-3">
            <nav
              className="flex items-center gap-0.5 sm:gap-1"
              aria-label="เมนูหลัก"
            >
              {navPages.map((page) => {
                const isActive = pathname === page.href;
                return (
                  <Link
                    key={page.id}
                    href={page.href}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium no-underline transition sm:px-4 sm:text-sm ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {t(page.labelKey)}
                  </Link>
                );
              })}
            </nav>

            <span className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" aria-hidden />

            <AdminAuthButton />
          </div>
        </div>
      </header>

      <main
        className={
          isAbout || isContact
            ? "relative z-10 pb-14 pt-28"
            : isJewelry
              ? "relative z-10 pb-16 pt-40"
            : isHome || isWorkshop
              ? "relative z-10 pb-14 pt-28"
              : "relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8"
        }
      >
        {children}
      </main>

      <footer className="relative z-10 border-t border-gray-200 bg-white/55 px-4 py-8 text-center text-sm text-luxury-muted">
        {t("app.footer")}
      </footer>
    </div>
  );
}
