import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getFormDataFile } from "@/lib/form-data-file";
import { uploadImage } from "@/lib/supabase-storage";
import { upsertTranslations } from "@/lib/translate";
import { uniqueSlug } from "@/lib/slug";
import { birthstoneDaySortOrder } from "@/lib/birthstone-days";

const boolField = z.preprocess(
  (value) => value === "true" || value === "on" || value === true,
  z.boolean()
);

const birthstoneSchema = z.object({
  day: z.string().min(1),
  gemName: z.string().optional(),
  gemNameEn: z.string().optional(),
  color: z.string().optional(),
  origin: z.string().optional(),
  hardness: z.string().optional(),
  detail: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: boolField.default(true),
});

function parseBirthstoneFormData(formData: FormData) {
  const entries = [...formData.entries()].filter(([, value]) => typeof value === "string");
  return birthstoneSchema.parse(Object.fromEntries(entries));
}

export async function createBirthstoneRecord(formData: FormData) {
  const data = parseBirthstoneFormData(formData);
  const image = getFormDataFile(formData, "image");
  if (!image) {
    throw new Error("กรุณาเลือกรูปก่อนบันทึก");
  }

  const gemName = data.gemName?.trim() || data.day;
  const slug = await uniqueSlug(data.day, (candidate) =>
    prisma.birthstone.findUnique({ where: { slug: candidate } }).then(Boolean)
  );
  const uploaded = await uploadImage(image, "birthstones");

  const stone = await prisma.birthstone.create({
    data: {
      month: data.day,
      gemName,
      gemNameEn: data.gemNameEn,
      color: data.color,
      origin: data.origin,
      hardness: data.hardness,
      detail: data.detail,
      sortOrder: birthstoneDaySortOrder(data.day),
      isActive: data.isActive,
      slug,
      imageUrl: uploaded.publicUrl,
    },
  });

  await upsertTranslations("birthstone", stone.id, {
    month: stone.month,
    gemName: stone.gemName,
    color: stone.color ?? "",
    origin: stone.origin ?? "",
    hardness: stone.hardness ?? "",
    detail: stone.detail ?? "",
  });

  revalidatePath("/");
  revalidatePath("/admin/birthstones");

  return stone;
}

export async function updateBirthstoneRecord(id: string, formData: FormData) {
  const existing = await prisma.birthstone.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("ไม่พบรายการพลอยวันเกิด");
  }

  const data = parseBirthstoneFormData(formData);
  const image = getFormDataFile(formData, "image");
  let imageUrl = existing.imageUrl;
  const gemName = data.gemName?.trim() || data.day;

  if (image) {
    const uploaded = await uploadImage(image, "birthstones");
    imageUrl = uploaded.publicUrl;
  }

  const stone = await prisma.birthstone.update({
    where: { id },
    data: {
      month: data.day,
      gemName,
      gemNameEn: data.gemNameEn,
      color: data.color,
      origin: data.origin,
      hardness: data.hardness,
      detail: data.detail,
      sortOrder: birthstoneDaySortOrder(data.day),
      isActive: data.isActive,
      imageUrl,
    },
  });

  await upsertTranslations("birthstone", stone.id, {
    month: stone.month,
    gemName: stone.gemName,
    color: stone.color ?? "",
    origin: stone.origin ?? "",
    hardness: stone.hardness ?? "",
    detail: stone.detail ?? "",
  });

  revalidatePath("/");
  revalidatePath("/admin/birthstones");
  revalidatePath(`/admin/birthstones/${id}`);

  return stone;
}
