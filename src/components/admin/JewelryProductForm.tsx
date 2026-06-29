"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  Package,
  Save,
  Settings2,
  ShoppingBag,
  Tag,
} from "lucide-react";
import type { ProductFormState } from "@/actions/admin";
import { GemDeleteButton } from "@/components/admin/GemDeleteButton";
import { ProductImagePicker } from "@/components/admin/ProductImagePicker";

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
  accent: string;
  price: number | null;
  sortOrder: number;
  isActive: boolean;
  images: JewelryProductImage[];
};

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200";

type JewelryProductFormProps = {
  categories: JewelryCategoryOption[];
  product?: JewelryProductFormValues;
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  deleteAction?: () => Promise<void>;
  backHref?: string;
  pageTitle: string;
  pageDescription?: string;
  submitLabel: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          กำลังบันทึก...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Package;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-stone-100 bg-stone-50/80 px-5 py-4">
        <div className="rounded-xl bg-white p-2.5 text-stone-700 shadow-sm ring-1 ring-stone-200">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-stone-500">{description}</p>}
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

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
    <label htmlFor={htmlFor} className={`block space-y-2 ${className}`}>
      <span className="text-sm font-medium text-stone-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs leading-relaxed text-stone-500">{hint}</span>}
    </label>
  );
}

export function JewelryProductForm({
  categories,
  product,
  action,
  deleteAction,
  backHref = "/admin/jewelry/products",
  pageTitle,
  pageDescription,
  submitLabel,
}: JewelryProductFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});

  const values = product ?? {
    categoryId: "",
    title: "",
    subtitle: "",
    description: "",
    accent: "",
    price: null,
    sortOrder: 0,
    isActive: true,
    images: [],
  };

  useEffect(() => {
    if (state.success) {
      const timer = window.setTimeout(() => {
        router.push(backHref);
        router.refresh();
      }, 900);
      return () => window.clearTimeout(timer);
    }
  }, [state.success, backHref, router]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-stone-900 p-3 text-white">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <Link href={backHref} className="text-sm text-stone-500 no-underline hover:text-stone-800">
                ← กลับรายการสินค้า
              </Link>
              <h1 className="mt-1 text-2xl font-bold text-stone-900">{pageTitle}</h1>
              {pageDescription && <p className="mt-1 text-sm text-stone-500">{pageDescription}</p>}
            </div>
          </div>
          {deleteAction && <GemDeleteButton deleteAction={deleteAction} label="ลบสินค้า" />}
        </div>
      </div>

      {state.error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">บันทึกไม่สำเร็จ</p>
            <p className="mt-1">{state.error}</p>
          </div>
        </div>
      )}

      {state.success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">บันทึกสำเร็จ</p>
            <p className="mt-1">{state.message ?? "กำลังกลับไปหน้ารายการ..."}</p>
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          ยังไม่มีหมวดหมู่สินค้า —{" "}
          <Link href="/admin/jewelry/categories" className="font-medium underline">
            สร้างหมวดหมู่ก่อน
          </Link>
        </div>
      )}

      <form action={formAction} encType="multipart/form-data" className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <Panel icon={Package} title="ข้อมูลสินค้า" description="ชื่อ หมวดหมู่ และราคาที่แสดงบนหน้าร้าน">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="หมวดหมู่" htmlFor="categoryId" required className="md:col-span-2">
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

              <Field label="ข้อมูลเพิ่มเติม" htmlFor="accent" hint="เช่น 925 silver">
                <input
                  id="accent"
                  name="accent"
                  defaultValue={values.accent}
                  placeholder="วัสดุ / จุดเด่น"
                  className={inputClass}
                />
              </Field>
            </div>
          </Panel>

          <Panel icon={Tag} title="รายละเอียดสินค้า" description="ข้อความที่แสดงในหน้ารายละเอียดสินค้า">
            <Field label="คำอธิบาย" htmlFor="description">
              <textarea
                id="description"
                name="description"
                rows={6}
                defaultValue={values.description}
                placeholder="อธิบายดีไซน์ วัสดุ และรายละเอียดที่ลูกค้าควรรู้"
                className={`${inputClass} resize-y`}
              />
            </Field>
          </Panel>

          <Panel icon={ImageIcon} title="รูปภาพสินค้า" description="อัปโหลดไฟล์ หรือวางลิงก์รูปได้">
            {values.images.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium text-stone-700">รูปปัจจุบัน</p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {values.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-stone-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.imageUrl} alt="" className="h-full w-full object-cover" />
                      {(image.isPrimary || index === 0) && (
                        <span className="absolute left-2 top-2 rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-medium text-white">
                          หลัก
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ProductImagePicker hint="รองรับ JPG, PNG, WebP — รูปแรกจะเป็นภาพหลัก" />

            <Field
              label="ลิงก์รูปภาพ (ทางเลือก)"
              htmlFor="imageUrl"
              hint="ใส่ URL หรือ path เช่น /images/Jewelry/ring/silv1.jpg คั่นด้วยบรรทัดใหม่หรือจุลภาค"
            >
              <textarea
                id="imageUrl"
                name="imageUrl"
                rows={3}
                placeholder={"/images/Jewelry/ring/silv1.jpg\nhttps://..."}
                className={`${inputClass} resize-y font-mono text-xs`}
              />
            </Field>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel icon={Settings2} title="การเผยแพร่" description="ควบคุมการแสดงผลบนหน้าร้าน">
            <Field label="ลำดับการแสดง" htmlFor="sortOrder" hint="เลขน้อยแสดงก่อน">
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={values.sortOrder}
                className={inputClass}
              />
            </Field>

            <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={values.isActive}
                value="true"
                className="h-4 w-4 rounded border-stone-300"
              />
              <span>
                <span className="block font-medium text-stone-800">เปิดใช้งาน</span>
                <span className="block text-xs text-stone-500">แสดงสินค้านี้บนหน้า Jewelry</span>
              </span>
            </label>
          </Panel>

          <div className="sticky top-24 space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <SubmitButton label={submitLabel} />
            <Link
              href={backHref}
              className="block w-full rounded-xl border border-stone-200 px-4 py-3 text-center text-sm font-medium text-stone-700 no-underline transition hover:bg-stone-50"
            >
              ยกเลิก
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
