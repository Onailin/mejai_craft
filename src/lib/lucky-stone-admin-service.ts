import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getFormDataFile, getFormDataBoolean } from "@/lib/form-data-file";
import { uploadImage } from "@/lib/supabase-storage";
import { upsertTranslations } from "@/lib/translate";
import { uniqueSlug } from "@/lib/slug";

const boolField = z.preprocess(
  (value) => value === "true" || value === "on" || value === true,
  z.boolean()
);

const luckyStoneSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  meaning: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: boolField.default(true),
});

function parseLuckyStoneFormData(formData: FormData) {
  const entries = [...formData.entries()].filter(
    ([key, value]) => typeof value === "string" && key !== "isActive"
  );
  const data = luckyStoneSchema.parse(Object.fromEntries(entries));
  return {
    ...data,
    meaning: data.meaning?.trim() || null,
    description: data.description?.trim() || null,
    isActive: getFormDataBoolean(formData, "isActive", true),
  };
}

async function nextSortOrder() {
  const last = await prisma.luckyStone.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? 0) + 1;
}

export async function createLuckyStoneRecord(formData: FormData) {
  const data = parseLuckyStoneFormData(formData);
  const image = getFormDataFile(formData, "image");
  if (!image) {
    throw new Error("กรุณาเลือกรูปก่อนบันทึก");
  }

  const slug = await uniqueSlug(data.name, (candidate) =>
    prisma.luckyStone.findUnique({ where: { slug: candidate } }).then(Boolean)
  );
  const uploaded = await uploadImage(image, "lucky-stones");
  const sortOrder = data.sortOrder > 0 ? data.sortOrder : await nextSortOrder();

  const stone = await prisma.luckyStone.create({
    data: {
      name: data.name.trim(),
      meaning: data.meaning,
      description: data.description,
      sortOrder,
      isActive: data.isActive,
      slug,
      imageUrl: uploaded.publicUrl,
    },
  });

  await upsertTranslations("lucky_stone", stone.id, {
    name: stone.name,
    meaning: stone.meaning ?? "",
    description: stone.description ?? "",
  });

  revalidatePath("/");
  revalidatePath("/admin/lucky-stones");

  return stone;
}

export async function updateLuckyStoneRecord(id: string, formData: FormData) {
  const existing = await prisma.luckyStone.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("ไม่พบรายการหินมงคล");
  }

  const data = parseLuckyStoneFormData(formData);
  const image = getFormDataFile(formData, "image");
  let imageUrl = existing.imageUrl;

  if (image) {
    const uploaded = await uploadImage(image, "lucky-stones");
    imageUrl = uploaded.publicUrl;
  }

  const stone = await prisma.luckyStone.update({
    where: { id },
    data: {
      name: data.name.trim(),
      meaning: data.meaning,
      description: data.description,
      sortOrder: data.sortOrder > 0 ? data.sortOrder : existing.sortOrder,
      isActive: data.isActive,
      imageUrl,
    },
  });

  await upsertTranslations("lucky_stone", stone.id, {
    name: stone.name,
    meaning: stone.meaning ?? "",
    description: stone.description ?? "",
  });

  revalidatePath("/");
  revalidatePath("/admin/lucky-stones");
  revalidatePath(`/admin/lucky-stones/${id}`);

  return stone;
}
