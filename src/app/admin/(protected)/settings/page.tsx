import { requireAdmin } from "@/lib/auth-helpers";
import { getSiteSettings } from "@/lib/content";
import { updateSiteSettings } from "@/actions/admin";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-stone-800">ตั้งค่าเว็บไซต์</h1>
        <p className="mt-1 text-sm text-stone-500">
          แท็กไลน์และลิงก์ LINE จะแสดงบนหน้าติดต่อหลังบันทึก
        </p>
      </div>
      <SiteSettingsForm settings={settings} action={updateSiteSettings} />
    </div>
  );
}
