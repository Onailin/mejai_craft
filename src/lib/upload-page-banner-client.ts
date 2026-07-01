export type PageBannerKey = "home" | "workshop";

type UploadResult =
  | { ok: true; imageUrl: string }
  | { ok: false; error: string };

function buildUploadUrl(pageKey: PageBannerKey, replaceUrl?: string) {
  const params = new URLSearchParams({ pageKey });
  if (replaceUrl) params.set("replaceUrl", replaceUrl);
  return `/api/admin/page-banners?${params.toString()}`;
}

export async function uploadPageBanner(
  formData: FormData,
  pageKey: PageBannerKey,
  options?: { replaceUrl?: string },
): Promise<UploadResult> {
  const response = await fetch(buildUploadUrl(pageKey, options?.replaceUrl), {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as { ok?: boolean; imageUrl?: string; error?: string };
  if (!response.ok || !data.ok || !data.imageUrl) {
    return { ok: false, error: data.error ?? "อัปโหลดไม่สำเร็จ" };
  }

  return { ok: true, imageUrl: data.imageUrl };
}

export async function deletePageBanner(pageKey: PageBannerKey, imageUrl: string): Promise<UploadResult> {
  const response = await fetch(
    `/api/admin/page-banners?pageKey=${pageKey}&imageUrl=${encodeURIComponent(imageUrl)}`,
    { method: "DELETE" },
  );

  const data = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || !data.ok) {
    return { ok: false, error: data.error ?? "ลบไม่สำเร็จ" };
  }

  return { ok: true, imageUrl };
}
