import { requireEditorOrAdmin } from "@/lib/auth-helpers";
import { signOut } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { adminNavItems } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireEditorOrAdmin();

  const navItems = adminNavItems.filter(
    (item) => !item.adminOnly || session.user.role === "ADMIN",
  );

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-dvh bg-stone-100">
      <AdminSidebar
        items={navItems}
        userEmail={session.user.email}
        userRole={session.user.role}
        logoutAction={logout}
      />

      <div className="lg:pl-64">
        <header className="hidden border-b border-stone-200 bg-white px-8 py-5 lg:block">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-400">Mejai Crafts</p>
          <p className="mt-1 text-sm text-stone-600">
            {session.user.email}
            <span className="mx-2 text-stone-300">·</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
              {session.user.role}
            </span>
          </p>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
