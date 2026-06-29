"use client";

import { useState, type ChangeEvent } from "react";
import { deleteWorkshopFeaturedImage } from "@/actions/admin";
import { uploadWorkshopImage } from "@/lib/upload-workshop-image-client";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

type FeaturedImage = {
  id: string;
  imageUrl: string;
};

type WorkshopFeaturedImagesFormProps = {
  workshopId: string;
  images: FeaturedImage[];
};

function validateFileSize(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    return "รูปใหญ่เกินไป (สูงสุด 5 MB)";
  }
  return null;
}

export function WorkshopFeaturedImagesForm({ workshopId, images }: WorkshopFeaturedImagesFormProps) {
  const [gallery, setGallery] = useState(images);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeError = validateFileSize(file);
    if (sizeError) {
      setError(sizeError);
      setSuccess(null);
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("workshopId", workshopId);
    formData.set("file", file);

    try {
      const result = await uploadWorkshopImage(formData, "featured");

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setGallery((current) => [
        ...current,
        { id: result.id ?? `new-${Date.now()}`, imageUrl: result.imageUrl },
      ]);
      setSuccess("เพิ่มรูปตัวอย่างเรียบร้อยแล้ว");
    } catch {
      setError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm("ยืนยันการลบรูปนี้?")) return;

    setDeletingId(imageId);
    setError(null);
    setSuccess(null);

    try {
      await deleteWorkshopFeaturedImage(imageId);
      setGallery((current) => current.filter((image) => image.id !== imageId));
      setSuccess("ลบรูปเรียบร้อยแล้ว");
    } catch {
      setError("ลบรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
      <div>
        <h2 className="font-medium text-stone-800">รูปตัวอย่าง</h2>
        <p className="mt-1 text-sm text-stone-500">รูปที่แสดงบนหน้าเวิร์คชอป (คารูเซลด้านบน)</p>
      </div>

      {error ? <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}
      {success ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div>
      ) : null}

      {gallery.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {gallery.map((img) => (
            <div key={img.id} className="group relative">
              <img src={img.imageUrl} alt="" className="h-24 w-32 rounded-lg object-cover ring-1 ring-stone-200" />
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                disabled={deletingId === img.id}
                className="absolute right-1 top-1 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-red-600 shadow-sm ring-1 ring-stone-200 transition hover:bg-red-50 disabled:opacity-60"
              >
                {deletingId === img.id ? "กำลังลบ..." : "ลบ"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-500">ยังไม่มีรูปตัวอย่าง</p>
      )}

      <label className="inline-flex cursor-pointer flex-col gap-2">
        <span className="text-sm text-stone-600">{uploading ? "กำลังอัปโหลด..." : "เลือกรูปเพิ่ม"}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={handleChange}
        />
      </label>
    </section>
  );
}
