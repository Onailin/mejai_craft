import { requireAdmin } from "@/lib/auth-helpers";
import { getSiteSettings } from "@/lib/content";
import { updateSiteSettings } from "@/actions/admin";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-stone-800">Site Settings</h1>
      <form action={updateSiteSettings} className="grid max-w-2xl gap-4 rounded-2xl border border-stone-200 bg-white p-6">
        {[
          { key: "phone", label: "เบอร์โทร" },
          { key: "address", label: "ที่อยู่" },
          { key: "maps_url", label: "Google Maps URL" },
          { key: "facebook_url", label: "Facebook URL" },
          { key: "brand_name", label: "ชื่อแบรนด์" },
          { key: "brand_tagline", label: "Tagline" },
          { key: "qrcode_url", label: "QR Code URL (คลาวด์)" },
          { key: "studio_image_url", label: "รูปสตูดิโอ URL (คลาวด์)" },
        ].map((field) => (
          <label key={field.key} className="space-y-1">
            <span className="text-sm text-stone-600">{field.label}</span>
            <input
              name={field.key}
              defaultValue={settings[field.key] ?? ""}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </label>
        ))}
        <button type="submit" className="w-fit rounded-full bg-stone-900 px-5 py-2 text-sm text-white">
          บันทึกการตั้งค่า
        </button>
      </form>
    </div>
  );
}
