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
import {
  createBirthstoneRecord,
  updateBirthstoneRecord,
} from "@/lib/birthstone-admin-service";
import {
  createLuckyStoneRecord,
  updateLuckyStoneRecord,
} from "@/lib/lucky-stone-admin-service";
import { formatActionError } from "@/lib/format-action-error";
import type { WorkshopFormState, WorkshopRingPricingState } from "@/types/workshop-admin";

export type { WorkshopFormState, WorkshopRingPricingState } from "@/types/workshop-admin";

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

export async function createLuckyStone(formData: FormData) {
  await requireEditorOrAdmin();
  await createLuckyStoneRecord(formData);
}

export async function updateLuckyStone(id: string, formData: FormData) {
  await requireEditorOrAdmin();
  await updateLuckyStoneRecord(id, formData);
}

export async function deleteLuckyStone(id: string) {
  await requireEditorOrAdmin();
  await prisma.luckyStone.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/lucky-stones");
  redirect("/admin/lucky-stones");
}

const birthstoneDays = BIRTHSTONE_DAY_OPTIONS;

export async function createBirthstone(formData: FormData) {
  await requireEditorOrAdmin();
  await createBirthstoneRecord(formData);
}

export async function updateBirthstone(id: string, formData: FormData) {
  await requireEditorOrAdmin();
  await updateBirthstoneRecord(id, formData);
}

export async function deleteBirthstone(id: string) {
  await requireEditorOrAdmin();
  await prisma.birthstone.delete({ where: { id } });
  revalidatePath("/birthstones");
  revalidatePath("/admin/birthstones");
}

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

  revalidatePath("/birthstones");
  revalidatePath("/admin/birthstones");
}

export async function clearBirthstoneDayImage(day: string) {
  await requireEditorOrAdmin();
  await prisma.birthstone.updateMany({
    where: { month: day },
    data: { imageUrl: null },
  });

  revalidatePath("/birthstones");
  revalidatePath("/admin/birthstones");
}

const categorySchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อหมวด"),
});

export async function createJewelryCategory(formData: FormData) {
  await requireEditorOrAdmin();
  const data = categorySchema.parse(Object.fromEntries(formData.entries()));
  const slug = await uniqueSlug(data.name, (s) =>
    prisma.jewelryCategory.findUnique({ where: { slug: s } }).then(Boolean)
  );
  const sortOrder = await prisma.jewelryCategory.count();

  const category = await prisma.jewelryCategory.create({
    data: {
      name: data.name,
      slug,
      displayMode: "GRID",
      sortOrder,
      isActive: true,
    },
  });
  await upsertTranslations("jewelry_category", category.id, { name: category.name });

  revalidatePath("/jewelry");
  revalidatePath("/admin/jewelry/categories");
  redirect("/admin/jewelry/categories");
}

export async function updateJewelryCategory(id: string, formData: FormData) {
  await requireEditorOrAdmin();
  const data = categorySchema.parse(Object.fromEntries(formData.entries()));
  const category = await prisma.jewelryCategory.update({
    where: { id },
    data: { name: data.name },
  });
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

import {
  createJewelryProductRecord,
  formatJewelryProductError,
  type ProductFormState,
  updateJewelryProductRecord,
} from "@/lib/jewelry-product-admin-service";

export type { ProductFormState };

export async function createJewelryProductFormAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    await requireEditorOrAdmin();
    const { message } = await createJewelryProductRecord(formData);
    return { success: true, message };
  } catch (error) {
    return { error: formatJewelryProductError(error) };
  }
}

export async function updateJewelryProductFormAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    await requireEditorOrAdmin();
    const { message } = await updateJewelryProductRecord(id, formData);
    return { success: true, message };
  } catch (error) {
    return { error: formatJewelryProductError(error) };
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
