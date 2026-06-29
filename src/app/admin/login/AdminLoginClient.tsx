"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { LoginSetupStatus } from "@/lib/db-setup-status";
import { BrandLogo } from "@/components/brand/BrandLogo";

const SETUP_MESSAGES: Record<Exclude<LoginSetupStatus, { ok: true }>["reason"], string> = {
  placeholder_password:
    "ยังไม่ได้ตั้งรหัสผ่านฐานข้อมูล — แก้ [YOUR-PASSWORD] ในไฟล์ .env ให้เป็นรหัสผ่านจริงจาก Supabase แล้วรัน npm run db:setup",
  db_unreachable:
    "เชื่อมต่อฐานข้อมูลไม่ได้ — ตรวจสอบ DATABASE_URL / DIRECT_URL ใน .env ว่ารหัสผ่านถูกต้อง",
  no_users:
    "ยังไม่มีบัญชีแอดมิน — รัน npm run db:setup หลังตั้งค่า .env ให้ครบ",
};

export default function AdminLoginPage({ setup }: { setup: LoginSetupStatus }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultEmail = setup.ok ? setup.adminEmail : "admin@mejaicrafts.com";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (!setup.ok) {
        setError(SETUP_MESSAGES[setup.reason]);
      } else {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
      return;
    }

    const callbackParam = searchParams.get("callbackUrl");
    const callbackUrl =
      callbackParam?.startsWith("/") && !callbackParam.startsWith("//")
        ? callbackParam
        : "/admin/dashboard";

    router.refresh();
    window.location.assign(callbackUrl);
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f7f7f5] px-4 py-10 font-sans text-stone-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0,transparent_45%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-stone-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />

      <section className="relative w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mb-3 flex justify-center">
            <BrandLogo size="xl" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-stone-400">
            Admin Console
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
            เข้าสู่ระบบจัดการเว็บไซต์
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            สำหรับจัดการสินค้า เวิร์คชอป รูปภาพ และเนื้อหาบนเว็บไซต์ Mejai Crafts
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-7 shadow-xl shadow-stone-900/[0.06] backdrop-blur sm:p-8"
        >
          {!setup.ok && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
              {SETUP_MESSAGES[setup.reason]}
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">อีเมล</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={defaultEmail}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3 text-sm outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">รหัสผ่าน</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3 text-sm outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100"
            />
          </label>

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่แผงจัดการ"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/" className="text-sm font-medium text-stone-500 no-underline transition hover:text-stone-900">
            กลับไปหน้าเว็บไซต์
          </Link>
        </div>
      </section>
    </main>
  );
}
