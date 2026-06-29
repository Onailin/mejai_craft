"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

type ProductImagePickerProps = {
  name?: string;
  multiple?: boolean;
  required?: boolean;
  label?: string;
  hint?: string;
};

export function ProductImagePicker({
  name = "images",
  multiple = true,
  required = false,
  label = "อัปโหลดรูปภาพ",
  hint = "รองรับ JPG, PNG, WebP — รูปแรกจะเป็นภาพหลัก",
}: ProductImagePickerProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    for (const url of previews) {
      URL.revokeObjectURL(url);
    }
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-stone-700">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-stone-500">{hint}</p>}
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 px-6 py-10 transition hover:border-stone-400 hover:bg-stone-100/80">
        <ImagePlus className="mb-3 h-8 w-8 text-stone-400" />
        <span className="text-sm font-medium text-stone-700">คลิกเพื่อเลือกรูป</span>
        <span className="mt-1 text-xs text-stone-500">
          {multiple ? "เลือกได้หลายรูป" : "เลือกได้ 1 รูป"}
        </span>
        <input
          name={name}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          required={required}
          className="sr-only"
          onChange={handleChange}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {previews.map((src, index) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-medium text-white">
                  หลัก
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
