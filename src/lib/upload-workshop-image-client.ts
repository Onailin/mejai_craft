export type WorkshopImageUploadKind = "sample" | "addon" | "featured";

export type WorkshopImageUploadResult =
  | { ok: true; imageUrl: string; id?: string }
  | { ok: false; error: string };

export async function uploadWorkshopImage(
  formData: FormData,
  kind: WorkshopImageUploadKind
): Promise<WorkshopImageUploadResult> {
  formData.set("kind", kind);

  const response = await fetch("/api/admin/workshop/images", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; imageUrl?: string; id?: string; error?: string }
    | null;

  if (!response.ok || !payload?.imageUrl) {
    return { ok: false, error: payload?.error ?? "อัปโหลดรูปไม่สำเร็จ" };
  }

  return { ok: true, imageUrl: payload.imageUrl, id: payload.id };
}
