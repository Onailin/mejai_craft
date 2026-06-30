"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireEditorOrAdmin } from "@/lib/auth-helpers";
import { getFormDataFile } from "@/lib/form-data-file";
import { uploadImage } from "@/lib/supabase-storage";
import { revalidateWorkshopPaths } from "@/lib/revalidate-workshop";
import { upsertTranslations } from "@/lib/translate";
import { uniqueSlug } from "@/lib/slug";
import { birthstoneDaySortOrder, BIRTHSTONE_DAY_OPTIONS, isBirthstoneDay } from "@/lib/birthstone-days";
import { DisplayMode, WorkshopAddonType, WorkshopRingSampleType } from "@prisma/client";

const boolField = z.preprocess(
  (v) => v === "true" || v === "on" || v === true,
  z.boolean()
);

const gemSchema = z.object({
  name: z.string().min(1),
  origin: z.string().optional(),
  color: z.string().optional(),
  detail: z.string().optional(),
  hardnessMin: z.coerce.number().optional(),
  hardnessMax: z.coerce.number().optional(),
  hardnessDisplay: z.string().optional(),
  hue: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: boolField.default(true),
  showInCollection: boolField.default(true),
  showInSlider: boolField.default(true),
});

export async function createGem(formData: FormData) {
  await requireEditorOrAdmin();
  const image = formData.get("image") as File | null;
  if (!image || image.size === 0) throw new Error("Image is required");

  const data = gemSchema.parse(Object.fromEntries(formData.entries()));
  const slug = await uniqueSlug(data.name, (s) =>
    prisma.gem.findUnique({ where: { slug: s } }).then(Boolean)
  );
  const { publicUrl } = await uploadImage(image, "gems");

  const gem = await prisma.gem.create({
    data: { ...data, slug, imageUrl: publicUrl },
  });

  await upsertTranslations("gem", gem.id, {
    name: gem.name,
    origin: gem.origin ?? "",
    color: gem.color ?? "",
    detail: gem.detail ?? "",
    hardnessDisplay: gem.hardnessDisplay ?? "",
  });

  revalidatePath("/");
  revalidatePath("/admin/gems");
}

export async function updateGem(id: string, formData: FormData) {
  await requireEditorOrAdmin();
  const existing = await prisma.gem.findUnique({ where: { id } });
  if (!existing) throw new Error("Gem not found");

  const data = gemSchema.parse(Object.fromEntries(formData.entries()));
  const image = formData.get("image") as File | null;
  let imageUrl = existing.imageUrl;

  if (image && image.size > 0) {
    const uploaded = await uploadImage(image, "gems");
    imageUrl = uploaded.publicUrl;
  }

  const gem = await prisma.gem.update({
    where: { id },
    data: { ...data, imageUrl },
  });

  await upsertTranslations("gem", gem.id, {
    name: gem.name,
    origin: gem.origin ?? "",
    color: gem.color ?? "",
    detail: gem.detail ?? "",
    hardnessDisplay: gem.hardnessDisplay ?? "",
  });

  revalidatePath("/");
  revalidatePath("/admin/gems");
  redirect("/admin/gems");
}

export async function deleteGem(id: string) {
  await requireEditorOrAdmin();
  await prisma.gem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/gems");
  redirect("/admin/gems");
}

const luckyStoneSchema = z.object({
  name: z.string().min(1),
  meaning: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: boolField.default(true),
});

export async function createLuckyStone(formData: FormData) {
  await requireEditorOrAdmin();
  const image = formData.get("image") as File | null;
  if (!image || image.size === 0) throw new Error("Image is required");

  const data = luckyStoneSchema.parse(Object.fromEntries(formData.entries()));
  const slug = await uniqueSlug(data.name, (s) =>
    prisma.luckyStone.findUnique({ where: { slug: s } }).then(Boolean)
  );
  const { publicUrl } = await uploadImage(image, "lucky-stones");

  const stone = await prisma.luckyStone.create({
    data: { ...data, slug, imageUrl: publicUrl },
  });

  await upsertTranslations("lucky_stone", stone.id, {
    name: stone.name,
    meaning: stone.meaning ?? "",
    description: stone.description ?? "",
  });

  revalidatePath("/");
  revalidatePath("/admin/lucky-stones");
}

export async function updateLuckyStone(id: string, formData: FormData) {
  await requireEditorOrAdmin();
  const existing = await prisma.luckyStone.findUnique({ where: { id } });
  if (!existing) throw new Error("Lucky stone not found");

  const data = luckyStoneSchema.parse(Object.fromEntries(formData.entries()));
  const image = formData.get("image") as File | null;
  let imageUrl = existing.imageUrl;

  if (image && image.size > 0) {
    const uploaded = await uploadImage(image, "lucky-stones");
    imageUrl = uploaded.publicUrl;
  }

  const stone = await prisma.luckyStone.update({
    where: { id },
    data: { ...data, imageUrl },
  });

  await upsertTranslations("lucky_stone", stone.id, {
    name: stone.name,
    meaning: stone.meaning ?? "",
    description: stone.description ?? "",
  });

  revalidatePath("/");
  revalidatePath("/admin/lucky-stones");
}

export async function deleteLuckyStone(id: string) {
  await requireEditorOrAdmin();
  await prisma.luckyStone.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/lucky-stones");
}

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

export async function createBirthstone(formData: FormData) {
  await requireEditorOrAdmin();
  const data = birthstoneSchema.parse(Object.fromEntries(formData.entries()));
  const image = getFormDataFile(formData, "image");
  const gemName = data.gemName?.trim() || data.day;
  const slug = await uniqueSlug(data.day, (s) =>
    prisma.birthstone.findUnique({ where: { slug: s } }).then(Boolean)
  );

  let imageUrl: string | undefined;
  if (image) {
    const uploaded = await uploadImage(image, "birthstones");
    imageUrl = uploaded.publicUrl;
  }

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
}

export async function updateBirthstone(id: string, formData: FormData) {
  await requireEditorOrAdmin();
  const existing = await prisma.birthstone.findUnique({ where: { id } });
  if (!existing) throw new Error("Birthstone not found");

  const data = birthstoneSchema.parse(Object.fromEntries(formData.entries()));
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
}

export async function deleteBirthstone(id: string) {
  await requireEditorOrAdmin();
  await prisma.birthstone.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/birthstones");
}

const birthstoneDays = BIRTHSTONE_DAY_OPTIONS;

export async function uploadBirthstoneDayImage(day: string, formData: FormData) {
  await requireEditorOrAdmin();
  if (!isBirthstoneDay(day)) {
    throw new Error("วันเกิดไม่ถูกต้อง");
  }

  const image = getFormDataFile(formData, "image");
  if (!image) throw new Error("กรุณาเลือกรูป");

  const { publicUrl } = await uploadImage(image, "birthstones");
  const existing = await prisma.birthstone.findFirst({ where: { month: day } });
  const sortOrder = birthstoneDaySortOrder(day);

  const stone = existing
    ? await prisma.birthstone.update({
        where: { id: existing.id },
        data: {
          month: day,
          gemName: day,
          imageUrl: publicUrl,
          sortOrder,
          isActive: true,
        },
      })
    : await prisma.birthstone.create({
        data: {
          slug: await uniqueSlug(day, (s) =>
            prisma.birthstone.findUnique({ where: { slug: s } }).then(Boolean)
          ),
          month: day,
          gemName: day,
          imageUrl: publicUrl,
          sortOrder,
          isActive: true,
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
}

export async function clearBirthstoneDayImage(day: string) {
  await requireEditorOrAdmin();
  await prisma.birthstone.updateMany({
    where: { month: day },
    data: { imageUrl: null },
  });

  revalidatePath("/");
  revalidatePath("/admin/birthstones");
}

const categorySchema = z.object({
  name: z.string().min(1),
  displayMode: z.nativeEnum(DisplayMode),
  sortOrder: z.coerce.number().default(0),
  isActive: boolField.default(true),
});

export async function createJewelryCategory(formData: FormData) {
  await requireEditorOrAdmin();
  const data = categorySchema.parse(Object.fromEntries(formData.entries()));
  const slug = await uniqueSlug(data.name, (s) =>
    prisma.jewelryCategory.findUnique({ where: { slug: s } }).then(Boolean)
  );

  const category = await prisma.jewelryCategory.create({ data: { ...data, slug } });
  await upsertTranslations("jewelry_category", category.id, { name: category.name });

  revalidatePath("/jewelry");
  revalidatePath("/admin/jewelry/categories");
  redirect("/admin/jewelry/categories");
}

export async function updateJewelryCategory(id: string, formData: FormData) {
  await requireEditorOrAdmin();
  const data = categorySchema.parse(Object.fromEntries(formData.entries()));
  const category = await prisma.jewelryCategory.update({ where: { id }, data });
  await upsertTranslations("jewelry_category", category.id, { name: category.name });

  revalidatePath("/jewelry");
  revalidatePath("/admin/jewelry/categories");
  redirect("/admin/jewelry/categories");
}

export async function deleteJewelryCategory(id: string) {
  await requireEditorOrAdmin();
  await prisma.jewelryCategory.delete({ where: { id } });
  revalidatePath("/jewelry");
  revalidatePath("/admin/jewelry/categories");
}

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
    isActive: formData.get("isActive"),
  });
}

function formatActionError(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.errors.map((issue) => issue.message).join(" · ");
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

async function attachProductImages(productId: string, formData: FormData, existingCount = 0) {
  const warnings: string[] = [];
  const files = formData.getAll("images") as File[];
  let sortOrder = existingCount;
  let isFirst = existingCount === 0;

  for (const file of files) {
    if (!file || file.size === 0) continue;
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
    } catch (error) {
      warnings.push(error instanceof Error ? error.message : "อัปโหลดรูปล้มเหลว");
    }
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
}

export async function createJewelryProductFormAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    await requireEditorOrAdmin();
    const data = parseProductFields(formData);
    const product = await prisma.jewelryProduct.create({ data });
    const warnings = await attachProductImages(product.id, formData);
    await saveJewelryProductTranslations(product);
    revalidateJewelryProductPaths(product.id);

    if (warnings.length > 0) {
      return {
        success: true,
        message: `บันทึกสินค้าแล้ว แต่บางรูปอัปโหลดไม่สำเร็จ: ${warnings.join(" · ")}`,
      };
    }

    return { success: true, message: "เพิ่มสินค้าเรียบร้อยแล้ว" };
  } catch (error) {
    return { error: formatActionError(error) };
  }
}

export async function updateJewelryProductFormAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    await requireEditorOrAdmin();
    const data = parseProductFields(formData);
    const product = await prisma.jewelryProduct.update({ where: { id }, data });
    const existingCount = await prisma.jewelryProductImage.count({ where: { productId: id } });
    const warnings = await attachProductImages(id, formData, existingCount);
    await saveJewelryProductTranslations(product);
    revalidateJewelryProductPaths(product.id);

    if (warnings.length > 0) {
      return {
        success: true,
        message: `บันทึกแล้ว แต่บางรูปอัปโหลดไม่สำเร็จ: ${warnings.join(" · ")}`,
      };
    }

    return { success: true, message: "บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว" };
  } catch (error) {
    return { error: formatActionError(error) };
  }
}

export async function createJewelryProduct(formData: FormData) {
  const result = await createJewelryProductFormAction({}, formData);
  if (result.error) throw new Error(result.error);
  redirect("/admin/jewelry/products");
}

export async function updateJewelryProduct(id: string, formData: FormData) {
  const result = await updateJewelryProductFormAction(id, {}, formData);
  if (result.error) throw new Error(result.error);
  redirect("/admin/jewelry/products");
}

export async function deleteJewelryProduct(id: string) {
  await requireEditorOrAdmin();
  await prisma.jewelryProduct.delete({ where: { id } });
  revalidatePath("/jewelry");
  revalidatePath(`/product/${id}`);
  revalidatePath("/admin/jewelry/products");
  redirect("/admin/jewelry/products");
}

const workshopSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  featuredTitle: z.string().optional(),
  featuredSubtitle: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: boolField.default(true),
});

export type WorkshopFormState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export type WorkshopRingPricingState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export async function updateWorkshopFormAction(
  _prev: WorkshopFormState,
  formData: FormData
): Promise<WorkshopFormState> {
  try {
    await requireEditorOrAdmin();
    const workshopId = String(formData.get("workshopId") ?? "").trim();
    if (!workshopId) throw new Error("ไม่พบเวิร์คชอป");

    const data = workshopSchema.parse(Object.fromEntries(formData.entries()));
    const workshop = await prisma.workshop.update({ where: { id: workshopId }, data });

    await upsertTranslations("workshop", workshop.id, {
      title: workshop.title,
      summary: workshop.summary ?? "",
      featuredTitle: workshop.featuredTitle ?? "",
      featuredSubtitle: workshop.featuredSubtitle ?? "",
    });

    revalidateWorkshopPaths(workshopId);
    return { success: true, message: "บันทึกข้อมูลเวิร์คชอปเรียบร้อยแล้ว" };
  } catch (error) {
    return { error: formatActionError(error) };
  }
}

export async function addWorkshopFeaturedImageFormAction(
  _prev: WorkshopFormState,
  formData: FormData
): Promise<WorkshopFormState> {
  try {
    await requireEditorOrAdmin();
    const workshopId = String(formData.get("workshopId") ?? "").trim();
    if (!workshopId) throw new Error("ไม่พบเวิร์คชอป");

    const image = getFormDataFile(formData, "image");
    if (!image) throw new Error("กรุณาเลือกรูป");

    const { saveWorkshopFeaturedImage } = await import("@/lib/workshop-image-upload");
    await saveWorkshopFeaturedImage(workshopId, image);
    revalidateWorkshopPaths(workshopId);
    return { success: true, message: "เพิ่มรูปตัวอย่างเรียบร้อยแล้ว" };
  } catch (error) {
    return { error: formatActionError(error) };
  }
}

export async function createWorkshop(formData: FormData) {
  await requireEditorOrAdmin();
  const data = workshopSchema.parse(Object.fromEntries(formData.entries()));
  const slug = await uniqueSlug(data.title, (s) =>
    prisma.workshop.findUnique({ where: { slug: s } }).then(Boolean)
  );

  const workshop = await prisma.workshop.create({ data: { ...data, slug } });
  await upsertTranslations("workshop", workshop.id, {
    title: workshop.title,
    summary: workshop.summary ?? "",
    featuredTitle: workshop.featuredTitle ?? "",
    featuredSubtitle: workshop.featuredSubtitle ?? "",
  });

  revalidatePath("/workshop");
  revalidatePath("/admin/workshops");
}

export async function updateWorkshop(id: string, formData: FormData) {
  formData.set("workshopId", id);
  const result = await updateWorkshopFormAction({}, formData);
  if (result.error) throw new Error(result.error);
}

export async function deleteWorkshop(id: string) {
  await requireEditorOrAdmin();
  await prisma.workshop.delete({ where: { id } });
  revalidatePath("/workshop");
  revalidatePath("/admin/workshops");
}

export async function deleteWorkshopFeaturedImage(imageId: string) {
  await requireEditorOrAdmin();
  const image = await prisma.workshopFeaturedImage.findUnique({
    where: { id: imageId },
    select: { workshopId: true },
  });
  if (!image) throw new Error("ไม่พบรูป");

  await prisma.workshopFeaturedImage.delete({ where: { id: imageId } });
  revalidateWorkshopPaths(image.workshopId);
}

export async function deleteWorkshopBannerImage(imageId: string) {
  await requireEditorOrAdmin();
  const image = await prisma.workshopBannerImage.findUnique({
    where: { id: imageId },
    select: { workshopId: true },
  });
  if (!image) throw new Error("ไม่พบรูป");

  await prisma.workshopBannerImage.delete({ where: { id: imageId } });
  revalidateWorkshopPaths(image.workshopId);
}

export async function deleteWorkshopRingSampleImage(workshopId: string, sampleType: string) {
  await requireEditorOrAdmin();
  await prisma.workshopRingSampleImage.deleteMany({
    where: {
      workshopId,
      sampleType: sampleType as WorkshopRingSampleType,
    },
  });
  revalidateWorkshopPaths(workshopId);
}

export async function deleteWorkshopAddonImage(workshopId: string, addonType: string) {
  await requireEditorOrAdmin();
  await prisma.workshopAddon.updateMany({
    where: {
      workshopId,
      addonType: addonType as WorkshopAddonType,
    },
    data: { imageUrl: null },
  });
  revalidateWorkshopPaths(workshopId);
}

export async function deleteWorkshopOptionImage(workshopId: string, optionId: string) {
  await requireEditorOrAdmin();
  await prisma.workshopOption.updateMany({
    where: {
      id: optionId,
      group: { workshopId },
    },
    data: { imageUrl: null },
  });
  revalidateWorkshopPaths(workshopId);
}

export async function addWorkshopBannerImage(workshopId: string, formData: FormData) {
  await requireEditorOrAdmin();
  const image = getFormDataFile(formData, "image");
  if (!image) throw new Error("กรุณาเลือกรูป");

  const count = await prisma.workshopBannerImage.count({ where: { workshopId } });
  const { publicUrl } = await uploadImage(image, "workshop/banners");
  await prisma.workshopBannerImage.create({
    data: { workshopId, imageUrl: publicUrl, sortOrder: count },
  });
  revalidateWorkshopPaths(workshopId);
}

export async function saveWorkshopRingPricing(
  _prev: WorkshopRingPricingState,
  formData: FormData
): Promise<WorkshopRingPricingState> {
  try {
    await requireEditorOrAdmin();

    const workshopId = String(formData.get("workshopId") ?? "").trim();
    if (!workshopId) {
      throw new Error("ไม่พบเวิร์คชอป");
    }

    const existing = await prisma.workshop.findUnique({
      where: { id: workshopId },
      include: { addons: true },
    });

    if (!existing) {
      throw new Error("ไม่พบเวิร์คชอป");
    }

    const {
      WORKSHOP_RING_SIZES,
      WORKSHOP_RING_STYLES,
      WORKSHOP_PLATING_OPTIONS,
      WORKSHOP_ADDON_OPTIONS,
      buildRingPriceFieldName,
      buildRingNoteFieldName,
      buildAddonPriceFieldName,
      buildAddonNoteFieldName,
      buildAddonLabelFieldName,
      parseOptionalPrice,
    } = await import("@/lib/workshop-ring-pricing");

    for (const style of WORKSHOP_RING_STYLES) {
      for (const sizeMm of WORKSHOP_RING_SIZES) {
        for (const plating of WORKSHOP_PLATING_OPTIONS) {
          const price = parseOptionalPrice(
            formData.get(buildRingPriceFieldName(style.value, sizeMm, plating.value))
          );
          const priceNote =
            String(formData.get(buildRingNoteFieldName(style.value, sizeMm, plating.value)) ?? "").trim() ||
            null;

          await prisma.workshopRingPrice.upsert({
            where: {
              workshopId_style_sizeMm_plating: {
                workshopId,
                style: style.value,
                sizeMm,
                plating: plating.value,
              },
            },
            create: {
              workshopId,
              style: style.value,
              sizeMm,
              plating: plating.value,
              price,
              priceNote,
            },
            update: { price, priceNote },
          });
        }
      }
    }

    for (const addon of WORKSHOP_ADDON_OPTIONS) {
      const label =
        String(formData.get(buildAddonLabelFieldName(addon.value)) ?? "").trim() || addon.defaultLabel;
      const price = parseOptionalPrice(formData.get(buildAddonPriceFieldName(addon.value)));
      const priceNote =
        String(formData.get(buildAddonNoteFieldName(addon.value)) ?? "").trim() || null;
      const currentAddon = existing.addons.find((row) => row.addonType === addon.value);

      await prisma.workshopAddon.upsert({
        where: {
          workshopId_addonType: {
            workshopId,
            addonType: addon.value,
          },
        },
        create: {
          workshopId,
          addonType: addon.value,
          label,
          price,
          priceNote,
          imageUrl: currentAddon?.imageUrl ?? null,
        },
        update: { label, price, priceNote },
      });
    }

    revalidateWorkshopPaths(workshopId);
    return { ok: true, message: "บันทึกราคาเรียบร้อยแล้ว" };
  } catch (error) {
    return { ok: false, error: formatActionError(error) };
  }
}

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const entries = Array.from(formData.entries());

  for (const [key, value] of entries) {
    if (typeof value !== "string") continue;
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

export async function updateTranslation(
  entityType: string,
  entityId: string,
  fieldName: string,
  locale: string,
  translatedText: string
) {
  await requireEditorOrAdmin();
  await prisma.contentTranslation.upsert({
    where: {
      entityType_entityId_fieldName_locale: { entityType, entityId, fieldName, locale },
    },
    create: { entityType, entityId, fieldName, locale, translatedText, isManualOverride: true },
    update: { translatedText, isManualOverride: true },
  });
  revalidatePath("/");
  revalidatePath("/jewelry");
  revalidatePath("/workshop");
}
