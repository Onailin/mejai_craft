"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ChangeEvent, type DragEvent } from "react";
import { ImagePlus, Loader2, Pencil, X } from "lucide-react";
import { updateBirthstone } from "@/actions/admin";
import { BIRTHSTONE_DAY_OPTIONS } from "@/lib/birthstone-days";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = {
  stoneId: string;
  initialDay: string;
  initialImageUrl: string | null;
  initialIsActive: boolean;
};

export function BirthstoneEditForm({
  stoneId,
  initialDay,
  initialImageUrl,
  initialIsActive,
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (fileMeta && previewUrl && previewUrl !== initialImageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [fileMeta, previewUrl, initialImageUrl]);

  function clearNewFile() {
    if (fileMeta && previewUrl && previewUrl !== initialImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(initialImageUrl);
    setFileMeta(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function applyFile(file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("รูปใหญ่เกินไป (สูงสุด 5 MB)");
      return;
    }
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("รองรับเฉพาะ JPG, PNG หรือ WebP");
      return;
    }

    if (fileMeta && previewUrl && previewUrl !== initialImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    setFileMeta({ name: file.name, size: file.size });
    setError(null);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    if (inputRef.current) inputRef.current.files = dataTransfer.files;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) applyFile(file);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) applyFile(file);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await updateBirthstone(stoneId, formData);
        router.push("/admin/birthstones");
        router.refresh();
      } catch {
        setError("บันทึกไม่สำเร็จ กรุณาลองใหม่");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="border-b border-stone-100 bg-gradient-to-r from-stone-50 to-amber-50/40 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white">
            <Pencil className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-stone-900">แก้ไขพลอยวันเกิด</h2>
            <p className="text-xs text-stone-500">เปลี่ยนวัน รูป หรือสถานะการแสดงผล</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-3">
          <p className="text-sm font-medium text-stone-700">รูป</p>
          <label
            htmlFor="birthstone-edit-image"
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
              isDragging
                ? "border-stone-900 bg-stone-100"
                : previewUrl
                  ? "border-stone-200 bg-stone-50"
                  : "border-stone-300 bg-stone-50/80 hover:border-stone-400 hover:bg-stone-100/80"
            }`}
          >
            {previewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="รูปพลอยวันเกิด"
                  className="h-full max-h-[280px] w-full object-contain p-4"
                />
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-stone-900/50 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-stone-800 shadow">
                    คลิกเพื่อเปลี่ยนรูป
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-stone-500 shadow-sm ring-1 ring-stone-200">
                  <ImagePlus className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-800">ลากรูปมาวาง หรือคลิกเพื่อเลือก</p>
                  <p className="mt-1 text-xs text-stone-500">JPG, PNG, WebP · สูงสุด 5 MB</p>
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              id="birthstone-edit-image"
              name="image"
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>

          {fileMeta ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-600 ring-1 ring-stone-200/80">
              <span className="truncate">{fileMeta.name}</span>
              <span className="shrink-0">{formatFileSize(fileMeta.size)}</span>
            </div>
          ) : initialImageUrl ? (
            <p className="text-xs text-stone-500">ไม่เลือกรูปใหม่จะใช้รูปเดิม</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">วัน</span>
            <select
              name="day"
              required
              defaultValue={initialDay}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-100"
            >
              {BIRTHSTONE_DAY_OPTIONS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={initialIsActive}
              value="true"
              className="h-4 w-4 rounded border-stone-300"
            />
            แสดงบนหน้า Home
          </label>

          {initialImageUrl?.startsWith("/uploads/") ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
              รูปนี้เก็บบนเครื่อง dev เท่านั้น — production จะเปิดไม่ได้ กรุณาอัปโหลดรูปใหม่หลังตั้งค่า Supabase Storage
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-600">
              อัปโหลดรูปใหม่เฉพาะเมื่อต้องการเปลี่ยนรูป
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                "บันทึกการแก้ไข"
              )}
            </button>
            {fileMeta ? (
              <button
                type="button"
                onClick={clearNewFile}
                disabled={pending}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                ยกเลิกรูปใหม่
              </button>
            ) : null}
            <Link
              href="/admin/birthstones"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 no-underline transition hover:bg-stone-50"
            >
              ยกเลิก
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
