"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus } from "lucide-react";
import { deleteWorkshopPendantFormAction } from "@/actions/workshop-pendants";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { displayPendantDescription } from "@/lib/workshop-pendant-utils";
import { createWorkshopPendantViaApi } from "@/lib/upload-workshop-pendant-client";
import type { WorkshopOptionView } from "@/types";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

function validateFileSize(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    return "รูปใหญ่เกินไป (สูงสุด 5 MB)";
  }
  return null;
}

function formatPrice(price: number | null) {
  if (price == null) return "สอบถามราคา";
  return `฿${price.toLocaleString("th-TH")}`;
}

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500";

type WorkshopPendantsTableProps = {
  workshopId: string;
  pendants: WorkshopOptionView[];
  onError: (message: string | null) => void;
  onSuccess: (message: string) => void;
};

export function WorkshopPendantsTable({
  workshopId,
  pendants,
  onError,
  onSuccess,
}: WorkshopPendantsTableProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function clearImageSelection() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeError = validateFileSize(file);
    if (sizeError) {
      onError(sizeError);
      event.target.value = "";
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
    onError(null);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setCreating(true);
    onError(null);

    const formData = new FormData();
    formData.set("label", label);
    formData.set("description", description);
    formData.set("price", price);

    const imageFile = imageInputRef.current?.files?.[0];
    if (imageFile) {
      formData.set("image", imageFile);
    }

    const result = await createWorkshopPendantViaApi(workshopId, formData);
    setCreating(false);

    if (!result.ok) {
      onError(result.error);
      return;
    }

    setLabel("");
    setDescription("");
    setPrice("");
    clearImageSelection();
    onSuccess(imageFile ? "เพิ่มจี้และอัปโหลดรูปแล้ว" : "เพิ่มจี้แล้ว");
    router.refresh();
  }

  return (
    <section className="space-y-5 rounded-2xl border border-stone-200 bg-stone-50/50 p-5">
      <header>
        <h3 className="text-base font-semibold text-stone-900">เพิ่มจี้</h3>
        <p className="mt-1 text-sm text-stone-500">เพิ่มรายการใหม่ แล้วแก้ไขรายละเอียดจากตารางด้านล่าง</p>
      </header>

      <form
        onSubmit={handleCreate}
        className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-2"
      >
        <p className="text-sm font-medium text-stone-800 md:col-span-2">ฟอร์มเพิ่มจี้ใหม่</p>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-600">ชื่อจี้ *</span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            required
            className={inputClass}
            placeholder="ชื่อจี้"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-stone-600">ราคา (บาท)</span>
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={inputClass}
            placeholder="ราคา"
          />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-medium text-stone-600">รายละเอียด</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="รายละเอียดจี้"
            rows={3}
          />
        </label>
        <div className="space-y-2 md:col-span-2">
          <span className="text-xs font-medium text-stone-600">รูปจี้</span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <label className="flex min-h-[120px] w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 px-4 py-4 text-center transition hover:border-stone-300 hover:bg-stone-100/80">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="ตัวอย่างรูปจี้"
                  className="max-h-28 w-full object-contain"
                />
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-stone-400" />
                  <span className="text-xs text-stone-500">คลิกเพื่อเลือกรูป</span>
                </>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>
            {imagePreview ? (
              <button
                type="button"
                onClick={clearImageSelection}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                ลบรูปที่เลือก
              </button>
            ) : null}
          </div>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {creating ? "กำลังเพิ่ม..." : "เพิ่มจี้"}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">รูป</th>
                <th className="px-4 py-3 font-medium">ชื่อ</th>
                <th className="px-4 py-3 font-medium">รายละเอียด</th>
                <th className="px-4 py-3 font-medium">ราคา</th>
                <th className="px-4 py-3 font-medium text-right">แก้ไข</th>
                <th className="px-4 py-3 font-medium text-right">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pendants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-stone-500">
                    ยังไม่มีจี้ — ใช้ฟอร์มด้านบนเพื่อเพิ่มรายการแรก
                  </td>
                </tr>
              ) : (
                pendants.map((option) => {
                  const description = displayPendantDescription(option.description);
                  return (
                    <tr key={option.id} className="hover:bg-stone-50/80">
                      <td className="px-4 py-3">
                        {option.imageUrl ? (
                          <img
                            src={option.imageUrl}
                            alt={option.label}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-400">
                            ไม่มีรูป
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900">{option.label}</td>
                      <td className="max-w-xs px-4 py-3 text-stone-600">
                        {description ? (
                          <span className="line-clamp-2">{description}</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-800">{formatPrice(option.price)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/workshops/${workshopId}/pendants/${option.id}`}
                          className="text-sm font-medium text-stone-700 no-underline hover:text-stone-900 hover:underline"
                        >
                          แก้ไข
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <GemDeleteButton
                          deleteAction={deleteWorkshopPendantFormAction.bind(null, option.id)}
                          className="border-0 bg-transparent px-0 py-0 text-sm text-red-600 hover:bg-transparent hover:text-red-700"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
