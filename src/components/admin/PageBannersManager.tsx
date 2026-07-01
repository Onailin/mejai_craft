"use client";

import { useState, type ChangeEvent } from "react";
import { deletePageBanner, uploadPageBanner } from "@/lib/upload-page-banner-client";
import { AdminNoticeStack } from "@/components/admin/AdminNotice";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

type PageBannersManagerProps = {
  initialHomeImage: string;
  initialWorkshopImages: string[];
};

function validateFileSize(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    return "รูปใหญ่เกินไป (สูงสุด 5 MB)";
  }
  return null;
}

export function PageBannersManager({ initialHomeImage, initialWorkshopImages }: PageBannersManagerProps) {
  const [homeImage, setHomeImage] = useState(initialHomeImage);
  const [workshopImages, setWorkshopImages] = useState(initialWorkshopImages);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleUpload(
    pageKey: "home" | "workshop",
    event: ChangeEvent<HTMLInputElement>,
    options?: { replaceUrl?: string },
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeError = validateFileSize(file);
    if (sizeError) {
      setError(sizeError);
      setSuccess(null);
      event.target.value = "";
      return;
    }

    const uploadKey = options?.replaceUrl ?? pageKey;
    setUploading(uploadKey);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("image", file);

    try {
      const result = await uploadPageBanner(formData, pageKey, options);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (pageKey === "home") {
        setHomeImage(result.imageUrl);
        setSuccess(options?.replaceUrl ? "เปลี่ยนแบนเนอร์หน้าแรกแล้ว" : "อัปเดตแบนเนอร์หน้าแรกแล้ว");
      } else if (options?.replaceUrl) {
        setWorkshopImages((current) =>
          current.map((url) => (url === options.replaceUrl ? result.imageUrl : url)),
        );
        setSuccess("เปลี่ยนรูปแบนเนอร์แล้ว");
      } else {
        setWorkshopImages((current) => [...current, result.imageUrl]);
        setSuccess("เพิ่มแบนเนอร์หน้าเวิร์คชอปแล้ว");
      }
    } catch {
      setError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  }

  async function handleDelete(pageKey: "home" | "workshop", imageUrl: string) {
    const label = pageKey === "home" ? "แบนเนอร์หน้าแรก" : "รูปนี้";
    if (!confirm(`ยืนยันการลบ${label}?`)) return;

    setDeletingUrl(imageUrl);
    setError(null);
    setSuccess(null);

    try {
      const result = await deletePageBanner(pageKey, imageUrl);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (pageKey === "home") {
        setHomeImage("");
        setSuccess("ลบแบนเนอร์หน้าแรกแล้ว");
      } else {
        setWorkshopImages((current) => current.filter((url) => url !== imageUrl));
        setSuccess("ลบแบนเนอร์แล้ว");
      }
    } catch {
      setError("ลบรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setDeletingUrl(null);
    }
  }

  return (
    <div className="space-y-8">
      <AdminNoticeStack
        error={error}
        success={success}
        onDismissError={() => setError(null)}
        onDismissSuccess={() => setSuccess(null)}
      />

      <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <div>
          <h2 className="font-medium text-stone-800">แบนเนอร์หน้าแรก (Home)</h2>
          <p className="mt-1 text-sm text-stone-500">รูปพื้นหลังใหญ่ด้านบนหน้าแรก — เปลี่ยนหรือลบได้</p>
        </div>

        {homeImage ? (
          <div className="flex flex-wrap items-start gap-4">
            <img
              src={homeImage}
              alt=""
              className="h-32 w-56 rounded-xl object-cover ring-1 ring-stone-200"
            />
            <div className="flex flex-col gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50">
                {uploading === "home" ? "กำลังอัปโหลด..." : "เปลี่ยนรูป"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploading !== null}
                  onChange={(event) => handleUpload("home", event, { replaceUrl: homeImage })}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => handleDelete("home", homeImage)}
                disabled={deletingUrl === homeImage}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {deletingUrl === homeImage ? "กำลังลบ..." : "ลบรูป"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-stone-500">ยังไม่มีแบนเนอร์ — หน้าแรกจะแสดงพื้นหลังเปล่า</p>
            <label className="inline-flex cursor-pointer flex-col gap-2">
              <span className="text-sm text-stone-600">
                {uploading === "home" ? "กำลังอัปโหลด..." : "อัปโหลดแบนเนอร์"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading !== null}
                onChange={(event) => handleUpload("home", event)}
                className="w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-stone-700 hover:file:bg-stone-200"
              />
            </label>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <div>
          <h2 className="font-medium text-stone-800">แบนเนอร์หน้าเวิร์คชอป</h2>
          <p className="mt-1 text-sm text-stone-500">
            รูปสไลด์ด้านบนหน้า /workshop — เปลี่ยน ลบ หรือเพิ่มได้ทุกรูป
          </p>
        </div>

        {workshopImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workshopImages.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50"
              >
                <img src={imageUrl} alt="" className="h-28 w-full object-cover" />
                <div className="flex gap-2 border-t border-stone-200 p-2">
                  <label className="flex-1 cursor-pointer rounded-md bg-white px-2 py-1.5 text-center text-xs font-medium text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100">
                    {uploading === imageUrl ? "กำลังอัปโหลด..." : "เปลี่ยนรูป"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading !== null}
                      onChange={(event) => handleUpload("workshop", event, { replaceUrl: imageUrl })}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDelete("workshop", imageUrl)}
                    disabled={deletingUrl === imageUrl}
                    className="rounded-md bg-white px-2 py-1.5 text-xs font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deletingUrl === imageUrl ? "..." : "ลบ"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-500">ยังไม่มีแบนเนอร์ — หน้าเวิร์คชอปจะไม่แสดงสไลด์</p>
        )}

        <label className="inline-flex cursor-pointer flex-col gap-2">
          <span className="text-sm text-stone-600">
            {uploading === "workshop" ? "กำลังอัปโหลด..." : "เพิ่มรูปแบนเนอร์"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading !== null}
            onChange={(event) => handleUpload("workshop", event)}
            className="w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-stone-700 hover:file:bg-stone-200"
          />
        </label>
      </section>
    </div>
  );
}
