"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BraceletJewelryProductView } from "@/lib/bracelet-jewelry-products";
import { BRACELET_STONE_PRICE } from "@/lib/workshop-bracelet-pricing";
import type { WorkshopOptionGroupView } from "@/types";
import { WorkshopPendantsTable } from "@/components/admin/WorkshopPendantsTable";
import { AdminNotice, AdminNoticeStack } from "@/components/admin/AdminNotice";

function formatPrice(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

type WorkshopBraceletPricingFormProps = {
  workshopId: string;
  optionGroups: WorkshopOptionGroupView[];
  braceletProducts: BraceletJewelryProductView[];
  manageProductsHref: string;
  braceletCategoryName?: string;
};

export function WorkshopBraceletPricingForm({
  workshopId,
  optionGroups,
  braceletProducts,
  manageProductsHref,
  braceletCategoryName,
}: WorkshopBraceletPricingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const pendantGroup = useMemo(
    () => optionGroups.find((group) => group.groupType === "ADDON"),
    [optionGroups],
  );

  const pendants = pendantGroup?.options ?? [];
  const productsWithoutImage = braceletProducts.filter((product) => !product.imageUrl).length;

  return (
    <section className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/70">
      <header className="border-b border-stone-100 pb-4">
        <h2 className="text-lg font-semibold text-stone-900">กำไลหิน</h2>
        <p className="mt-1 text-sm text-stone-500">รายการกำไลดึงจากสินค้าจิวเวลรี่ — แก้ชื่อและรูปที่หน้าสินค้า</p>
      </header>

      <AdminNoticeStack
        error={error}
        success={success}
        onDismissError={() => setError(null)}
        onDismissSuccess={() => setSuccess(null)}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-stone-500">
              {braceletCategoryName
                ? `แสดงสินค้าจากหมวด "${braceletCategoryName}" — แก้รูปและชื่อที่หน้าสินค้า`
                : "แสดงสินค้าจากหมวดกำไล — แก้รูปและชื่อที่หน้าสินค้า"}
          </p>
          <Link
            href={manageProductsHref}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 no-underline transition hover:bg-stone-50"
          >
            จัดการสินค้ากำไล
          </Link>
        </div>

        {braceletProducts.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-stone-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">รูป</th>
                    <th className="px-4 py-3 font-medium">ชื่อสินค้า</th>
                    <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                    <th className="px-4 py-3 font-medium">ราคา</th>
                    <th className="px-4 py-3 font-medium text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {braceletProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50/80">
                      <td className="px-4 py-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="h-14 w-14 rounded-lg object-cover ring-1 ring-stone-200"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-50 text-[10px] font-medium text-amber-700 ring-1 ring-amber-200">
                            ไม่มีรูป
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900">{product.title}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                          {product.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-800">
                        {formatPrice(product.price ?? BRACELET_STONE_PRICE)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/jewelry/products/${product.id}`}
                          className="text-sm font-medium text-stone-700 no-underline hover:text-stone-900 hover:underline"
                        >
                          แก้ไข
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <AdminNotice
            variant="warning"
            message="ยังไม่มีสินค้ากำไล — เพิ่มสินค้าและอัปโหลดรูปที่หน้าสินค้าจิวเวลรี่"
          />
        )}

        {productsWithoutImage > 0 ? (
          <p className="text-xs text-amber-700">
            มี {productsWithoutImage} รายการที่ยังไม่มีรูป — จะไม่แสดงบนหน้าเวิร์คชอปจนกว่าจะอัปโหลดรูป
          </p>
        ) : null}
      </div>

      <WorkshopPendantsTable
          workshopId={workshopId}
          pendants={pendants}
          onError={setError}
          onSuccess={(message) => {
            setSuccess(message);
            setError(null);
          }}
        />
    </section>
  );
}
