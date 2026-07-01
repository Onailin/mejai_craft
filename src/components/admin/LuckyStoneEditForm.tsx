"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ChangeEvent, type DragEvent } from "react";
import { ImagePlus, Loader2, Pencil, X } from "lucide-react";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { updateLuckyStoneViaApi } from "@/lib/upload-lucky-stone-client";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = {
  stoneId: string;
  initialName: string;
  initialMeaning: string;
  initialDescription: string;
  initialImageUrl: string;
  initialIsActive: boolean;
};

export function LuckyStoneEditForm({
  stoneId,
  initialName,
  initialMeaning,
  initialDescription,
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
      setError("รูปใหญ่เกินไป (สูงสุด 4 MB)");
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
    const file = inputRef.current?.files?.[0];
    if (file) {
      formData.set("image", file);
    }

    startTransition(async () => {
      const result = await updateLuckyStoneViaApi(stoneId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/lucky-stones");
      router.refresh();
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="border-b border-stone-100 bg-gradient-to-r from-stone-50 to-violet-50/40 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white">
            <Pencil className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-stone-900">แก้ไขหินมงคล</h2>
            <p className="text-xs text-stone-500">ไม่เลือกรูปใหม่ = ใช้รูปเดิม</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-3">
          <p className="text-sm font-medium text-stone-700">รูป</p>
          <label
            htmlFor="lucky-stone-edit-image"
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
                  alt={initialName}
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
                <p className="text-sm font-medium text-stone-800">เลือกรูปใหม่</p>
              </div>
            )}

            <input
              ref={inputRef}
              id="lucky-stone-edit-image"
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
              <button
                type="button"
                onClick={clearNewFile}
                className="shrink-0 text-stone-500 hover:text-stone-800"
              >
                ยกเลิกรูปใหม่
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">ชื่อ</span>
            <input
              name="name"
              required
              defaultValue={initialName}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">ความหมาย</span>
            <input
              name="meaning"
              defaultValue={initialMeaning}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-700">คำอธิบาย</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={initialDescription}
              className="w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-100"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initialIsActive}
              className="h-4 w-4 rounded border-stone-300"
            />
            แสดงบนหน้าแรก
          </label>

          {error ? (
            <AdminNotice
              variant="error"
              title="บันทึกไม่สำเร็จ"
              message={error}
              onDismiss={() => setError(null)}
            />
          ) : null}

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
            <Link
              href="/admin/lucky-stones"
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
