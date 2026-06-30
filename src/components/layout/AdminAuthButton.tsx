import Link from "next/link";

type AdminAuthButtonProps = {
  tone?: "default" | "onDark";
};

export function AdminAuthButton({ tone = "default" }: AdminAuthButtonProps) {
  const onDark = tone === "onDark";

  return (
    <Link
      href="/admin/login"
      className={`relative z-50 inline-flex items-center justify-center rounded-full px-3.5 py-2 text-xs font-medium no-underline transition sm:px-4 sm:text-sm ${
        onDark ? "w-full py-2.5" : "shrink-0"
      } ${
        onDark
          ? "border border-white/30 bg-white/15 text-white hover:bg-white/25"
          : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      เข้าสู่ระบบ
    </Link>
  );
}
