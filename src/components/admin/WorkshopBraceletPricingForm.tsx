"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { deleteWorkshopOptionImage } from "@/actions/admin";
import { uploadWorkshopImage } from "@/lib/upload-workshop-image-client";
import { BRACELET_STONE_PRICE, getBraceletImageClass, getBraceletImageFrameClass, type BraceletImageVariant } from "@/lib/workshop-bracelet-pricing";
import type { WorkshopOptionGroupView } from "@/types";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function validateFileSize(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    return "รูปใหญ่เกินไป (สูงสุด 5 MB)";
  }
  return null;
}

function formatPrice(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

function OptionUploadField({
  optionId,
  label,
  price,
  imageUrl,
  workshopId,
  variant,
  onPreview,
  onError,
  onSuccess,
}: {
  optionId: string;
  label: string;
  price: number | null;
  imageUrl: string;
  workshopId: string;
  variant: BraceletImageVariant;
  onPreview: (key: string, url: string) => void;
  onError: (message: string | null) => void;
  onSuccess: (message: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!imageUrl) return;
    if (!confirm(`ยืนยันการลบรูป ${label}?`)) return;

    setDeleting(true);
    onError(null);

    try {
      await deleteWorkshopOptionImage(workshopId, optionId);
      onPreview(optionId, "");
      onSuccess(`ลบรูป ${label} แล้ว`);
    } catch {
      onError("ลบรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setDeleting(false);
    }
  }

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeError = validateFileSize(file);
    if (sizeError) {
      onError(sizeError);
      event.target.value = "";
      return;
    }

    const previousUrl = imageUrl;
    const localUrl = URL.createObjectURL(file);
    onPreview(optionId, localUrl);
    setUploading(true);
    onError(null);

    const formData = new FormData();
    formData.set("workshopId", workshopId);
    formData.set("optionId", optionId);
    formData.set("file", file);

    try {
      const result = await uploadWorkshopImage(formData, "option");

      if (!result.ok) {
        onPreview(optionId, previousUrl);
        onError(result.error);
        return;
      }

      onPreview(optionId, result.imageUrl);
      onSuccess(`อัปโหลดรูป ${label} สำเร็จ`);
    } catch {
      onPreview(optionId, previousUrl);
      onError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      URL.revokeObjectURL(localUrl);
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-center">
      {imageUrl ? (
        <div className={getBraceletImageFrameClass(variant)}>
          <img src={imageUrl} alt={label} className={getBraceletImageClass(variant)} />
        </div>
      ) : (
        <div className={`${getBraceletImageFrameClass(variant)} text-xs text-stone-400`}>
          ยังไม่มีรูป
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-stone-900">{label}</p>
        {price != null ? (
          <p className="mt-1 text-sm font-medium text-stone-700">{formatPrice(price)}</p>
        ) : null}
      </div>
      <label className="w-full cursor-pointer">
        <span className="inline-flex w-full items-center justify-center rounded-md bg-stone-100 px-2 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200">
          {uploading ? "กำลังอัปโหลด..." : "เลือกรูป"}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={uploading || deleting}
          onChange={handleChange}
        />
      </label>
      {imageUrl ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={uploading || deleting}
          className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
        >
          {deleting ? "กำลังลบ..." : "ลบรูป"}
        </button>
      ) : null}
    </div>
  );
}

type WorkshopBraceletPricingFormProps = {
  workshopId: string;
  optionGroups: WorkshopOptionGroupView[];
};

export function WorkshopBraceletPricingForm({
  workshopId,
  optionGroups,
}: WorkshopBraceletPricingFormProps) {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const stoneGroup = useMemo(
    () => optionGroups.find((group) => group.groupType === "CUSTOM"),
    [optionGroups]
  );
  const pendantGroup = useMemo(
    () => optionGroups.find((group) => group.groupType === "ADDON"),
    [optionGroups]
  );

  return (
    <section className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/70">
      <header className="border-b border-stone-100 pb-4">
        <h2 className="text-lg font-semibold text-stone-900">กำไลหินและจี้</h2>
        <p className="mt-1 text-sm text-stone-500">
          อัปโหลดรูปตัวอย่าง — กำไลหินทุกชนิดราคา {formatPrice(BRACELET_STONE_PRICE)} · จี้เลเซอร์{" "}
          {formatPrice(666)} · จี้ฝังพลอย+เลเซอร์ {formatPrice(999)}
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      {stoneGroup ? (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-stone-900">กำไลหินแต่ละชนิด</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stoneGroup.options.map((option) => (
              <OptionUploadField
                key={option.id}
                optionId={option.id}
                label={option.label}
                price={option.price ?? BRACELET_STONE_PRICE}
                imageUrl={previews[option.id] ?? option.imageUrl}
                workshopId={workshopId}
                variant="stone"
                onPreview={(key, url) => setPreviews((current) => ({ ...current, [key]: url }))}
                onError={setError}
                onSuccess={(message) => {
                  setSuccess(message);
                  setError(null);
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {pendantGroup ? (
        <div className="space-y-4 border-t border-stone-100 pt-6">
          <h3 className="text-base font-semibold text-stone-900">จี้</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {pendantGroup.options.map((option) => (
              <OptionUploadField
                key={option.id}
                optionId={option.id}
                label={option.label}
                price={option.price}
                imageUrl={previews[option.id] ?? option.imageUrl}
                workshopId={workshopId}
                variant="pendant"
                onPreview={(key, url) => setPreviews((current) => ({ ...current, [key]: url }))}
                onError={setError}
                onSuccess={(message) => {
                  setSuccess(message);
                  setError(null);
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
