"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AdminAuthButton } from "@/components/layout/AdminAuthButton";
import { t } from "@/lib/copy";

const navPages = [
  { id: "jewelry", href: "/jewelry", label: t("nav_jewelry") },
  { id: "workshop", href: "/workshop", label: t("nav_workshop") },
  { id: "birthstones", href: "/birthstones", label: t("nav_birthstones") },
  { id: "about", href: "/about", label: t("nav_about") },
  { id: "contact", href: "/contact", label: t("nav_contact") },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const isAbout = pathname === "/about";
  const isContact = pathname === "/contact";
  const isHome = pathname === "/";
  const isWorkshop = pathname === "/workshop";
  const isJewelry = pathname === "/jewelry";
  const isBirthstones = pathname === "/birthstones";

  return (
    <div className="min-h-dvh bg-[#f7f7f5] font-sans text-luxury-ink">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,#ffffff_0,transparent_45%)]" />

      <header className="fixed inset-x-0 top-0 z-50 overflow-visible border-b border-gray-200/80 bg-white/95 shadow-sm shadow-gray-900/[0.03] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="relative z-50 inline-flex h-10 w-[5.5rem] shrink-0 items-center overflow-visible no-underline sm:h-11 sm:w-[6.25rem]"
          >
            <BrandLogo size="sm" className="origin-left scale-[2.35] sm:scale-[2.65] md:scale-[2.85]" />
          </Link>

          <div className="relative z-50 hidden shrink-0 items-center gap-2 md:flex sm:gap-3">
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
                    {page.label}
                  </Link>
                );
              })}
            </nav>

            <span className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" aria-hidden />

            <AdminAuthButton />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200/80 bg-white/75 text-stone-800 shadow-sm backdrop-blur-md transition hover:bg-white/90 md:hidden"
            aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <aside
          className="mobile-sidebar-in fixed inset-0 z-[70] flex flex-col bg-neutral-950 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="เมนูหลักมือถือ"
        >
          <div className="flex items-center justify-between border-b border-white/15 px-5 pb-5 pt-7">
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white transition hover:bg-white/25"
              aria-label="ปิดเมนู"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-6 py-8" aria-label="เมนูหลักมือถือ">
            {navPages.map((page) => {
              const isActive = pathname === page.href;
              return (
                <Link
                  key={page.id}
                  href={page.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-4 text-lg no-underline transition ${
                    isActive
                      ? "bg-white/15 font-semibold text-white"
                      : "font-medium text-white hover:bg-white/10"
                  }`}
                >
                  {page.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/15 p-6 pb-10">
            <AdminAuthButton tone="onDark" />
          </div>
        </aside>
      ) : null}

      <main
        className={
          isAbout || isContact
            ? "relative z-10 pb-14 pt-24"
            : isJewelry || isBirthstones
              ? "relative z-10 pb-16 pt-32"
            : isHome || isWorkshop
              ? "relative z-10 pb-14 pt-24"
              : "relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 lg:px-8"
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
