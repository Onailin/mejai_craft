"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import type { AdminNavItem } from "./admin-nav";
import { adminNavIconMap } from "./admin-nav-icons";

type Props = {
  items: AdminNavItem[];
  userEmail: string;
  userRole: string;
  logoutAction: () => Promise<void>;
};

function isActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({ items, userEmail, userRole, logoutAction }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = adminNavIconMap[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm no-underline transition-colors ${
              active
                ? "bg-stone-900 font-medium text-white"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-stone-400"}`} />
            <span className="min-w-0 truncate">{item.labelTh}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-400">Mejai Admin</p>
          <p className="text-sm text-stone-800">{userEmail}</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-stone-200 p-2 text-stone-700"
          aria-label="เปิดเมนู"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="ปิดเมนู"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5">
          <Link href="/admin/dashboard" className="no-underline">
            <BrandLogo size="sm" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-stone-500 hover:text-stone-900 lg:hidden"
            aria-label="ปิดเมนู"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {nav}

        <div className="mt-auto space-y-2 border-t border-stone-200 px-4 py-4">
          <div className="rounded-lg bg-stone-50 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-stone-900">{userEmail}</p>
            <p className="text-xs text-stone-500">{userRole}</p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 no-underline hover:bg-stone-100 hover:text-stone-900"
          >
            <ExternalLink className="h-4 w-4" />
            ดูเว็บไซต์
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
            >
              <LogOut className="h-4 w-4" />
              ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
