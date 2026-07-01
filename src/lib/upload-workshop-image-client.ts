import type { WorkshopImageUploadResult } from "@/types/workshop-admin";

export type WorkshopImageUploadKind = "sample" | "addon" | "option" | "featured" | "banner";

export type { WorkshopImageUploadResult };

async function parseUploadResponse(response: Response): Promise<WorkshopImageUploadResult> {
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; imageUrl?: string; id?: string; error?: string }
    | null;

  if (!response.ok || !payload?.imageUrl) {
    return { ok: false, error: payload?.error ?? "อัปโหลดรูปไม่สำเร็จ" };
  }

  return { ok: true, imageUrl: payload.imageUrl, id: payload.id };
}

export async function uploadWorkshopImage(
  formData: FormData,
  kind: WorkshopImageUploadKind,
): Promise<WorkshopImageUploadResult> {
  formData.set("kind", kind);

  const response = await fetch("/api/admin/workshop/images", {
    method: "POST",
    body: formData,
  }).catch(() => null);

  if (!response) {
    return {
      ok: false,
      error: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณารีเฟรชหน้าแล้วลองใหม่",
    };
  }

  return parseUploadResponse(response);
}
