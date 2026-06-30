"use client";

import { useEffect, useRef, useState, useTransition, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import {
  createJewelryProductViaApi,
  updateJewelryProductViaApi,
} from "@/lib/upload-jewelry-product-client";

export type JewelryCategoryOption = {
  id: string;
  name: string;
};

export type JewelryProductImage = {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
};

export type JewelryProductFormValues = {
  categoryId: string;
  title: string;
  subtitle: string;
  description: string;
  price: number | null;
  isActive: boolean;
  images: JewelryProductImage[];
};

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200";

type JewelryProductFormProps = {
  categories: JewelryCategoryOption[];
  product?: JewelryProductFormValues;
  productId?: string;
  deleteAction?: () => Promise<void>;
  backHref?: string;
  pageTitle: string;
  pageDescription?: string;
  submitLabel: string;
};

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`block space-y-1.5 ${className}`}>
      <span className="text-sm text-stone-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export function JewelryProductForm({
  categories,
  product,
  productId,
  deleteAction,
  backHref = "/admin/jewelry/products",
  pageTitle,
  pageDescription,
  submitLabel,
}: JewelryProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const values = product ?? {
    categoryId: "",
    title: "",
    subtitle: "",
    description: "",
    price: null,
    isActive: true,
    images: [],
  };

  const coverImage =
    values.images.find((image) => image.isPrimary)?.imageUrl ?? values.images[0]?.imageUrl ?? "";
  const previewSrc = newPreviews[0] ?? coverImage;
  const hasLocalOnlyImages = values.images.some((image) => image.imageUrl.startsWith("/uploads/"));

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => {
      router.push(backHref);
      router.refresh();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [successMessage, backHref, router]);

  useEffect(() => {
    return () => {
      for (const url of newPreviews) {
        URL.revokeObjectURL(url);
      }
    };
  }, [newPreviews]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    for (const url of newPreviews) {
      URL.revokeObjectURL(url);
    }
    setNewPreviews(files.map((file) => URL.createObjectURL(file)));
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.delete("images");
    const files = Array.from(fileInputRef.current?.files ?? []);
    for (const file of files) {
      if (file.size > MAX_IMAGE_BYTES) {
        setError(`รูป ${file.name} ใหญ่เกินไป (สูงสุด 4 MB)`);
        return;
      }
      formData.append("images", file);
    }

    startTransition(async () => {
      setError(null);
      setSuccessMessage(null);

      const result = productId
        ? await updateJewelryProductViaApi(productId, formData)
        : await createJewelryProductViaApi(formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccessMessage(result.message);
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={backHref} className="text-sm text-stone-500 no-underline hover:text-stone-800">
            ← กลับรายการสินค้า
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">{pageTitle}</h1>
          {pageDescription && <p className="text-sm text-stone-500">{pageDescription}</p>}
        </div>
        {deleteAction && <GemDeleteButton deleteAction={deleteAction} label="ลบสินค้า" />}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">บันทึกไม่สำเร็จ</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">บันทึกสำเร็จ</p>
            <p className="mt-1">{successMessage}</p>
          </div>
        </div>
      )}

      {hasLocalOnlyImages ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          รูปเดิมบางรูปเก็บบนเครื่อง dev เท่านั้น — production จะเปิดไม่ได้ กรุณาเลือกรูปใหม่แล้วบันทึกอีกครั้ง
        </div>
      ) : null}

      {categories.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          ยังไม่มีหมวดหมู่สินค้า —{" "}
          <Link href="/admin/jewelry/categories" className="font-medium underline">
            สร้างหมวดหมู่ก่อน
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <Field label="รูปภาพสินค้า" className="space-y-3">
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt={values.title || "รูปสินค้า"}
              className="aspect-square w-full max-w-xs rounded-xl object-cover ring-1 ring-stone-200"
            />
          ) : (
            <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-400">
              ยังไม่มีรูป
            </div>
          )}

          {(values.images.length > 1 || newPreviews.length > 1) && (
            <div className="flex flex-wrap gap-2">
              {values.images.slice(1).map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover ring-1 ring-stone-200"
                />
              ))}
              {newPreviews.slice(1).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="h-16 w-16 rounded-lg object-cover ring-1 ring-stone-200" />
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            name="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-stone-700 hover:file:bg-stone-200"
            onChange={handleImageChange}
          />
          <span className="block text-xs text-stone-500">
            รองรับ JPG, PNG, WebP — เลือกได้หลายรูป สูงสุด 4 MB ต่อรูป รูปแรกจะเป็นภาพหลัก
          </span>
        </Field>

        <Field label="หมวดหมู่" htmlFor="categoryId" required>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={values.categoryId}
            className={inputClass}
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="ชื่อสินค้า" htmlFor="title" required>
          <input
            id="title"
            name="title"
            required
            defaultValue={values.title}
            placeholder="เช่น แหวนเงิน"
            className={inputClass}
          />
        </Field>

        <Field label="คำบรรยายสั้น" htmlFor="subtitle">
          <input
            id="subtitle"
            name="subtitle"
            defaultValue={values.subtitle}
            placeholder="เช่น Silver Ring"
            className={inputClass}
          />
        </Field>

        <Field label="ราคา (บาท)" htmlFor="price" hint="เว้นว่างหากต้องการแสดง “สอบถามราคา”">
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={values.price ?? ""}
            placeholder="3500"
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="hidden" name="isActive" value="false" />
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={values.isActive}
            value="true"
            className="h-4 w-4 rounded border-stone-300"
          />
          เปิดใช้งานบนหน้าร้าน
          <span className="text-xs text-stone-500">(ต้องติ๊กถึงจะแสดงที่ /jewelry)</span>
        </label>

        <Field label="รายละเอียดสินค้า" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={values.description}
            placeholder="อธิบายดีไซน์ วัสดุ และรายละเอียดที่ลูกค้าควรรู้"
            className={`${inputClass} resize-y`}
          />
        </Field>

        <div className="flex flex-wrap items-center justify-start gap-2 border-t border-stone-100 pt-5">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {submitLabel}
              </>
            )}
          </button>
          <Link
            href={backHref}
            className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm text-stone-700 no-underline transition hover:bg-stone-50"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}
