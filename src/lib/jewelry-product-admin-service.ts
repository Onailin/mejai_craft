import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getFormDataFiles, getFormDataBoolean } from "@/lib/form-data-file";
import { uploadImage } from "@/lib/supabase-storage";
import { repairJewelryProductImages } from "@/lib/repair-content-images";
import { upsertTranslations } from "@/lib/translate";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const boolField = z.preprocess(
  (value) => value === "true" || value === "on" || value === true,
  z.boolean()
);

const productFieldsSchema = z.object({
  categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  title: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  price: z.number().int().min(0).nullable().optional(),
  isActive: boolField.default(true),
});

export type ProductFormState = {
  error?: string;
  success?: boolean;
  message?: string;
};

function parseProductFields(formData: FormData) {
  const priceRaw = formData.get("price");
  let price: number | null = null;

  if (typeof priceRaw === "string" && priceRaw.trim() !== "") {
    const parsed = Number(priceRaw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new Error("ราคาไม่ถูกต้อง");
    }
    price = Math.floor(parsed);
  }

  return productFieldsSchema.parse({
    categoryId: formData.get("categoryId"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    description: formData.get("description") || undefined,
    price,
    isActive: getFormDataBoolean(formData, "isActive", true),
  });
}

export function formatJewelryProductError(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.errors.map((issue) => issue.message).join(" · ");
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

async function attachProductImages(productId: string, formData: FormData, existingCount = 0) {
  const files = getFormDataFiles(formData, "images");
  if (files.length === 0) {
    return [];
  }

  const warnings: string[] = [];
  let sortOrder = existingCount;
  let isFirst = existingCount === 0;

  if (existingCount > 0) {
    await prisma.jewelryProductImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });
    isFirst = true;
  }

  let uploadedCount = 0;

  for (const file of files) {
    if (file.size > MAX_IMAGE_BYTES) {
      warnings.push(`${file.name}: รูปใหญ่เกินไป (สูงสุด 4 MB)`);
      continue;
    }

    try {
      const { publicUrl } = await uploadImage(file, "jewelry");
      await prisma.jewelryProductImage.create({
        data: {
          productId,
          imageUrl: publicUrl,
          sortOrder,
          isPrimary: isFirst,
        },
      });
      sortOrder += 1;
      isFirst = false;
      uploadedCount += 1;
    } catch (error) {
      warnings.push(error instanceof Error ? error.message : "อัปโหลดรูปล้มเหลว");
    }
  }

  if (uploadedCount === 0) {
    throw new Error(warnings.join(" · ") || "อัปโหลดรูปไม่สำเร็จ");
  }

  return warnings;
}

async function saveJewelryProductTranslations(product: {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  accent: string | null;
}) {
  await upsertTranslations("jewelry_product", product.id, {
    title: product.title,
    subtitle: product.subtitle ?? "",
    description: product.description ?? "",
    accent: product.accent ?? "",
  });
}

function revalidateJewelryProductPaths(productId: string) {
  revalidatePath("/jewelry");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/admin/jewelry/products");
  revalidatePath("/workshop");
}

export async function createJewelryProductRecord(formData: FormData) {
  const files = getFormDataFiles(formData, "images");
  if (files.length === 0) {
    throw new Error("กรุณาเลือกรูปภาพสินค้าก่อนบันทึก");
  }

  const data = parseProductFields(formData);
  const product = await prisma.jewelryProduct.create({ data });
  const warnings = await attachProductImages(product.id, formData);
  await repairJewelryProductImages(product.id);
  await saveJewelryProductTranslations(product);
  revalidateJewelryProductPaths(product.id);

  return {
    product,
    message:
      warnings.length > 0
        ? `บันทึกสินค้าแล้ว แต่บางรูปอัปโหลดไม่สำเร็จ: ${warnings.join(" · ")}`
        : "เพิ่มสินค้าเรียบร้อยแล้ว",
  };
}

export async function updateJewelryProductRecord(id: string, formData: FormData) {
  const data = parseProductFields(formData);
  const product = await prisma.jewelryProduct.update({ where: { id }, data });
  const existingCount = await prisma.jewelryProductImage.count({ where: { productId: id } });
  const warnings = await attachProductImages(id, formData, existingCount);
  await repairJewelryProductImages(id);
  await saveJewelryProductTranslations(product);
  revalidateJewelryProductPaths(product.id);

  return {
    product,
    message:
      warnings.length > 0
        ? `บันทึกแล้ว แต่บางรูปอัปโหลดไม่สำเร็จ: ${warnings.join(" · ")}`
        : "บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว",
  };
}
