"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { AdminNoticeStack } from "@/components/admin/AdminNotice";
import { SITE_LINE_URL } from "@/lib/brand";
import type { SiteSettingsFormState } from "@/actions/admin";

const FIELDS = [
  { key: "phone", label: "เบอร์โทร" },
  { key: "address", label: "ที่อยู่" },
  { key: "maps_url", label: "Google Maps URL" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "line_url", label: "ลิงก์ LINE" },
  { key: "brand_name", label: "ชื่อแบรนด์" },
  { key: "brand_tagline", label: "แท็กไลน์" },
  { key: "qrcode_url", label: "QR Code URL (คลาวด์)" },
  { key: "studio_image_url", label: "รูปสตูดิโอ URL (คลาวด์)" },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit rounded-full bg-stone-900 px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
    </button>
  );
}

type SiteSettingsFormProps = {
  settings: Record<string, string>;
  action: (prevState: SiteSettingsFormState, formData: FormData) => Promise<SiteSettingsFormState>;
};

export function SiteSettingsForm({ settings, action }: SiteSettingsFormProps) {
  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.ok) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.ok]);

  return (
    <form action={formAction} className="grid max-w-2xl gap-4 rounded-2xl border border-stone-200 bg-white p-6">
      <AdminNoticeStack
        error={state.error}
        success={state.ok ? (state.message ?? "บันทึกการตั้งค่าเรียบร้อยแล้ว") : null}
        successTitle="บันทึกสำเร็จ"
        className="md:col-span-1"
      />

      {FIELDS.map((field) => (
        <label key={field.key} className="space-y-1">
          <span className="text-sm text-stone-600">{field.label}</span>
          <input
            name={field.key}
            defaultValue={
              settings[field.key] ??
              (field.key === "line_url" ? SITE_LINE_URL : "")
            }
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </label>
      ))}

      <SubmitButton />
    </form>
  );
}
