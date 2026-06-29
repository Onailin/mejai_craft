import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-stone-100 px-4">
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-stone-800">Unauthorized</h1>
        <p className="mt-2 text-sm text-stone-500">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        <Link href="/admin/dashboard" className="mt-6 inline-block rounded-full bg-stone-900 px-5 py-2 text-sm text-white no-underline">
          กลับ Dashboard
        </Link>
      </div>
    </div>
  );
}
