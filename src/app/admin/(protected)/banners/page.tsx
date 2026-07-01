import { getAdminPageBanners } from "@/lib/page-banner-admin-service";
import { PageBannersManager } from "@/components/admin/PageBannersManager";
import { requireEditorOrAdmin } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  await requireEditorOrAdmin();
  const banners = await getAdminPageBanners();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">แบนเนอร์เว็บไซต์</h1>
        <p className="mt-1 text-sm text-stone-500">
          จัดการรูปแบนเนอร์หน้าแรกและหน้าเวิร์คชอป — แยกจากข้อมูลแต่ละคอร์สเวิร์คชอป
        </p>
      </div>

      <PageBannersManager
        initialHomeImage={banners.homeImage}
        initialWorkshopImages={banners.workshopImages}
      />
    </div>
  );
}
