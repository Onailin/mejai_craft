"use client";

import { useActionState, useCallback, useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { deleteWorkshopAddonImage, deleteWorkshopRingSampleImage } from "@/actions/workshop-images";
import type { WorkshopRingPricingState } from "@/types/workshop-admin";
import { uploadWorkshopImage } from "@/lib/upload-workshop-image-client";
import {
  WORKSHOP_ADDON_OPTIONS,
  WORKSHOP_PLATING_OPTIONS,
  WORKSHOP_RING_REFERENCE_GROUPS,
  WORKSHOP_RING_SIZES,
  WORKSHOP_RING_STYLES,
  buildAddonLabelFieldName,
  buildAddonNoteFieldName,
  buildAddonPriceFieldName,
  buildRingNoteFieldName,
  buildRingPriceFieldName,
  type WorkshopAddonCell,
  type WorkshopRingPriceCell,
  type WorkshopRingSampleType,
} from "@/lib/workshop-ring-pricing";
import type { WorkshopAddon, WorkshopRingPrice, WorkshopRingSampleImage } from "@prisma/client";
import { AdminNoticeStack } from "@/components/admin/AdminNotice";

const inputClass =
  "w-full min-w-[88px] rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200";

type WorkshopRingPricingFormProps = {
  workshopId: string;
  ringPrices: WorkshopRingPrice[];
  ringSampleImages: WorkshopRingSampleImage[];
  addons: WorkshopAddon[];
  saveAction: (
    prevState: WorkshopRingPricingState,
    formData: FormData
  ) => Promise<WorkshopRingPricingState>;
};

function getRingCell(
  ringPrices: WorkshopRingPrice[],
  style: WorkshopRingPriceCell["style"],
  sizeMm: number,
  plating: WorkshopRingPriceCell["plating"]
) {
  return ringPrices.find(
    (row) => row.style === style && row.sizeMm === sizeMm && row.plating === plating
  );
}

function getAddonCell(addons: WorkshopAddon[], addonType: WorkshopAddonCell["addonType"]) {
  return addons.find((addon) => addon.addonType === addonType);
}

function getSampleImage(
  samples: WorkshopRingSampleImage[],
  sampleType: WorkshopRingSampleType
) {
  return samples.find((sample) => sample.sampleType === sampleType)?.imageUrl ?? "";
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function validateFileSize(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    return "รูปใหญ่เกินไป (สูงสุด 5 MB)";
  }
  return null;
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/70">
      <header className="mb-5 border-b border-stone-100 pb-4">
        <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

function ImagePreview({
  src,
  alt,
  round = true,
}: {
  src?: string;
  alt: string;
  round?: boolean;
}) {
  const shape = round ? "rounded-full" : "rounded-xl";

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`aspect-square w-24 object-cover ring-1 ring-stone-200 ${shape}`}
      />
    );
  }

  return (
    <div
      className={`flex aspect-square w-24 items-center justify-center bg-stone-100 text-xs text-stone-400 ${shape}`}
    >
      ยังไม่มีรูป
    </div>
  );
}

function SampleUploadField({
  label,
  sampleType,
  imageUrl,
  workshopId,
  onPreview,
  onError,
  onSuccess,
}: {
  label: string;
  sampleType: WorkshopRingSampleType;
  imageUrl: string;
  workshopId: string;
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
      await deleteWorkshopRingSampleImage(workshopId, sampleType);
      onPreview(sampleType, "");
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
    onPreview(sampleType, localUrl);
    setUploading(true);
    onError(null);

    const formData = new FormData();
    formData.set("workshopId", workshopId);
    formData.set("sampleType", sampleType);
    formData.set("file", file);

    try {
      const result = await uploadWorkshopImage(formData, "sample");

      if (!result.ok) {
        onPreview(sampleType, previousUrl);
        onError(result.error);
        return;
      }

      onPreview(sampleType, result.imageUrl);
      onSuccess(`อัปโหลดรูป ${label} สำเร็จ`);
    } catch {
      onPreview(sampleType, previousUrl);
      onError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      URL.revokeObjectURL(localUrl);
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex w-36 flex-col items-center gap-3 text-center">
      <span className="text-sm font-medium text-stone-800">{label}</span>
      <ImagePreview src={imageUrl} alt={label} />
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

function AddonImageUpload({
  addonType,
  label,
  imageUrl,
  workshopId,
  onPreview,
  onError,
  onSuccess,
}: {
  addonType: WorkshopAddonCell["addonType"];
  label: string;
  imageUrl: string;
  workshopId: string;
  onPreview: (key: string, url: string) => void;
  onError: (message: string | null) => void;
  onSuccess: (message: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const key = `addon_${addonType}`;

  async function handleDelete() {
    if (!imageUrl) return;
    if (!confirm(`ยืนยันการลบรูป ${label}?`)) return;

    setDeleting(true);
    onError(null);

    try {
      await deleteWorkshopAddonImage(workshopId, addonType);
      onPreview(key, "");
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
    onPreview(key, localUrl);
    setUploading(true);
    onError(null);

    const formData = new FormData();
    formData.set("workshopId", workshopId);
    formData.set("addonType", addonType);
    formData.set("file", file);

    try {
      const result = await uploadWorkshopImage(formData, "addon");

      if (!result.ok) {
        onPreview(key, previousUrl);
        onError(result.error);
        return;
      }

      onPreview(key, result.imageUrl);
      onSuccess(`อัปโหลดรูป ${label} สำเร็จ`);
    } catch {
      onPreview(key, previousUrl);
      onError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      URL.revokeObjectURL(localUrl);
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex items-start gap-4">
      <ImagePreview src={imageUrl} alt={label} round={false} />
      <label className="min-w-0 flex-1 cursor-pointer pt-1">
        <span className="mb-2 block text-xs text-stone-500">
          {uploading ? "กำลังอัปโหลด..." : "เลือกรูปตัวอย่าง"}
        </span>
        <span className="inline-flex rounded-md bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200">
          อัปโหลดรูป
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

function PricingTable({
  style,
  ringPrices,
}: {
  style: WorkshopRingPriceCell["style"];
  ringPrices: WorkshopRingPrice[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-left text-stone-500">
            <th className="px-3 py-3 font-medium">ชุบสี</th>
            {WORKSHOP_RING_SIZES.map((sizeMm) => (
              <th key={sizeMm} className="px-3 py-3 font-medium">
                {sizeMm} มม.
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WORKSHOP_PLATING_OPTIONS.map((plating) => (
            <tr key={plating.value} className="border-b border-stone-100 align-top">
              <td className="px-3 py-4 font-medium text-stone-800">{plating.label}</td>
              {WORKSHOP_RING_SIZES.map((sizeMm) => {
                const cell = getRingCell(ringPrices, style, sizeMm, plating.value);
                return (
                  <td key={sizeMm} className="px-3 py-4">
                    <div className="space-y-2">
                      <input
                        name={buildRingPriceFieldName(style, sizeMm, plating.value)}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={cell?.price ?? ""}
                        placeholder="ราคา"
                        className={inputClass}
                      />
                      <input
                        name={buildRingNoteFieldName(style, sizeMm, plating.value)}
                        type="text"
                        defaultValue={cell?.priceNote ?? ""}
                        placeholder="หมายเหตุ"
                        className={inputClass}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "กำลังบันทึก..." : "บันทึกราคา"}
    </button>
  );
}

export function WorkshopRingPricingForm({
  workshopId,
  ringPrices,
  ringSampleImages,
  addons,
  saveAction,
}: WorkshopRingPricingFormProps) {
  const [state, formAction] = useActionState(saveAction, {});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const syncPreviews = useCallback(() => {
    setPreviews(() => {
      const next: Record<string, string> = {};
      for (const group of WORKSHOP_RING_REFERENCE_GROUPS) {
        for (const item of group.items) {
          next[item.sampleType] = getSampleImage(ringSampleImages, item.sampleType);
        }
      }
      for (const addon of WORKSHOP_ADDON_OPTIONS) {
        const cell = getAddonCell(addons, addon.value);
        next[`addon_${addon.value}`] = cell?.imageUrl ?? "";
      }
      return next;
    });
  }, [ringSampleImages, addons]);

  useEffect(() => {
    syncPreviews();
  }, [syncPreviews]);

  useEffect(() => {
    if (state.ok) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.ok]);

  function handlePreview(key: string, url: string) {
    setPreviews((current) => ({ ...current, [key]: url }));
  }

  function handleUploadSuccess(message: string) {
    setUploadSuccess(message);
    setUploadError(null);
  }

  const noticeError = state.error ?? uploadError;
  const noticeSuccess =
    uploadSuccess ??
    (state.ok ? (state.message ?? "บันทึกราคาเรียบร้อยแล้ว") : null);

  return (
    <form action={formAction} className="space-y-6">
      <AdminNoticeStack
        error={noticeError}
        success={noticeSuccess}
        onDismissError={() => {
          setUploadError(null);
        }}
        onDismissSuccess={() => setUploadSuccess(null)}
        successTitle="บันทึกสำเร็จ"
      />

      {WORKSHOP_RING_REFERENCE_GROUPS.map((group) => (
        <FormSection key={group.title} title={group.title} description={group.description}>
          <div className="flex flex-wrap gap-8">
            {group.items.map((item) => (
              <SampleUploadField
                key={item.sampleType}
                label={item.label}
                sampleType={item.sampleType}
                imageUrl={previews[item.sampleType] ?? ""}
                workshopId={workshopId}
                onPreview={handlePreview}
                onError={setUploadError}
                onSuccess={handleUploadSuccess}
              />
            ))}
          </div>
        </FormSection>
      ))}

      {WORKSHOP_RING_STYLES.map((style) => (
        <FormSection
          key={style.value}
          title={style.label}
          description="กรอกราคาแยกตามขนาดและชุบสี"
        >
          <PricingTable style={style.value} ringPrices={ringPrices} />
        </FormSection>
      ))}

      <FormSection title="บริการเสริม" description="เลเซอร์ และฝังพลอย">
        <div className="grid gap-8 md:grid-cols-2">
          {WORKSHOP_ADDON_OPTIONS.map((addon) => {
            const cell = getAddonCell(addons, addon.value);
            return (
              <div key={addon.value} className="space-y-4">
                <AddonImageUpload
                  addonType={addon.value}
                  label={cell?.label ?? addon.defaultLabel}
                  imageUrl={previews[`addon_${addon.value}`] ?? ""}
                  workshopId={workshopId}
                  onPreview={handlePreview}
                  onError={setUploadError}
                  onSuccess={handleUploadSuccess}
                />
                <input
                  name={buildAddonLabelFieldName(addon.value)}
                  type="text"
                  defaultValue={cell?.label ?? addon.defaultLabel}
                  placeholder="ชื่อบริการ"
                  className={inputClass}
                />
                <input
                  name={buildAddonPriceFieldName(addon.value)}
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={cell?.price ?? ""}
                  placeholder="ราคา (บาท)"
                  className={inputClass}
                />
                <input
                  name={buildAddonNoteFieldName(addon.value)}
                  type="text"
                  defaultValue={cell?.priceNote ?? ""}
                  placeholder="หมายเหตุ"
                  className={inputClass}
                />
              </div>
            );
          })}
        </div>
      </FormSection>

      <div className="flex justify-end">
        <SubmitButton />
      </div>

      <input type="hidden" name="workshopId" value={workshopId} />
    </form>
  );
}
