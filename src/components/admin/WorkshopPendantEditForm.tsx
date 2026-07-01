"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, Loader2, Pencil } from "lucide-react";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { updateWorkshopPendantViaApi } from "@/lib/upload-workshop-pendant-client";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500";

type WorkshopPendantEditFormProps = {
  workshopId: string;
  optionId: string;
  backHref: string;
  initialLabel: string;
  initialDescription: string;
  initialPrice: number | null;
  initialImageUrl: string | null;
};

export function WorkshopPendantEditForm({
  workshopId,
  optionId,
  backHref,
  initialLabel,
  initialDescription,
  initialPrice,
  initialImageUrl,
}: WorkshopPendantEditFormProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== initialImageUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, initialImageUrl]);

  function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      setError("รูปใหญ่เกินไป (สูงสุด 5 MB)");
      event.target.value = "";
      return;
    }

    if (previewUrl && previewUrl !== initialImageUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = imageInputRef.current?.files?.[0];
    if (file) {
      formData.set("image", file);
    }

    startTransition(async () => {
      const result = await updateWorkshopPendantViaApi(workshopId, optionId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(backHref);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="border-b border-stone-100 bg-stone-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white">
            <Pencil className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium text-stone-900">แก้ไขจี้</p>
            <p className="text-xs text-stone-500">อัปเดตชื่อ รายละเอียด ราคา และรูป</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {error ? (
          <AdminNotice
            variant="error"
            title="บันทึกไม่สำเร็จ"
            message={error}
            onDismiss={() => setError(null)}
          />
        ) : null}

        <label className="block space-y-1">
          <span className="text-sm text-stone-600">ชื่อจี้ *</span>
          <input
            name="label"
            required
            defaultValue={initialLabel}
            className={inputClass}
            placeholder="ชื่อจี้"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-stone-600">รายละเอียด</span>
          <textarea
            name="description"
            defaultValue={initialDescription}
            rows={4}
            className={`${inputClass} min-h-[100px] resize-y`}
            placeholder="รายละเอียดจี้"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-stone-600">ราคา (บาท)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={initialPrice ?? ""}
            className={inputClass}
            placeholder="เว้นว่างหากสอบถามราคา"
          />
        </label>

        <div className="space-y-2">
          <span className="text-sm text-stone-600">รูปจี้</span>
          <label className="flex min-h-[140px] max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 px-4 py-4 text-center transition hover:border-stone-300 hover:bg-stone-100/80">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="max-h-32 w-full object-contain" />
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
        </div>

        <div className="flex flex-wrap gap-2 border-t border-stone-100 pt-5">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "บันทึก"
            )}
          </button>
          <Link
            href={backHref}
            className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm text-stone-700 no-underline hover:bg-stone-50"
          >
            ยกเลิก
          </Link>
        </div>
      </div>
    </form>
  );
}
