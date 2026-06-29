"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export function AdminAuthButton() {
  const { data: session, status } = useSession();

  const isStaff =
    session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";

  if (status === "loading") {
    return (
      <span className="relative z-50 inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-400 sm:px-4 sm:text-sm">
        ...
      </span>
    );
  }

  if (isStaff) {
    return (
      <Link
        href="/admin/dashboard"
        className="relative z-50 inline-flex shrink-0 items-center rounded-full bg-gray-900 px-3.5 py-2 text-xs font-medium text-white no-underline transition hover:bg-gray-700 sm:px-4 sm:text-sm"
      >
        แอดมิน
      </Link>
    );
  }

  return (
    <Link
      href="/admin/login?callbackUrl=/admin/dashboard"
      className="relative z-50 inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 no-underline transition hover:border-gray-300 hover:bg-gray-50 sm:px-4 sm:text-sm"
    >
      เข้าสู่ระบบ
    </Link>
  );
}
