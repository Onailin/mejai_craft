import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getFormDataFile } from "@/lib/form-data-file";
import { formatActionError } from "@/lib/format-action-error";
import { revalidateWorkshopPaths } from "@/lib/revalidate-workshop";
import { saveWorkshopOptionImage } from "@/lib/workshop-image-upload";

export function formatWorkshopPendantError(error: unknown) {
  return formatActionError(error);
}

export async function ensurePendantOptionGroup(workshopId: string) {
  const existing = await prisma.workshopOptionGroup.findFirst({
    where: { workshopId, groupType: "ADDON" },
  });

  if (existing) return existing;

  return prisma.workshopOptionGroup.create({
    data: {
      workshopId,
      groupType: "ADDON",
      title: "จี้",
      description: "",
      sortOrder: 1,
    },
  });
}

/** ลบหินเทมเพลตเก่าในกลุ่ม CUSTOM (STONE:...) — กำไลใช้สินค้าจิวเวลรี่แทน */
export async function removeLegacyBraceletStoneOptions(workshopId: string) {
  const customGroups = await prisma.workshopOptionGroup.findMany({
    where: { workshopId, groupType: "CUSTOM" },
    select: { id: true },
  });

  for (const group of customGroups) {
    await prisma.workshopOption.deleteMany({
      where: {
        groupId: group.id,
        description: { startsWith: "STONE:" },
      },
    });
  }

  await prisma.workshopOptionGroup.deleteMany({
    where: {
      workshopId,
      groupType: "CUSTOM",
      options: { none: {} },
    },
  });
}

/** ลบจี้เทมเพลตเก่าที่ระบบสร้างไว้ (PENDANT:...) */
export async function removeLegacyPendantTemplates(workshopId: string) {
  const group = await prisma.workshopOptionGroup.findFirst({
    where: { workshopId, groupType: "ADDON" },
    select: { id: true },
  });
  if (!group) return;

  await prisma.workshopOption.deleteMany({
    where: {
      groupId: group.id,
      description: { startsWith: "PENDANT:" },
    },
  });
}

function parsePrice(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.floor(parsed);
}

export async function createWorkshopPendantRecord(workshopId: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  if (!label) throw new Error("กรุณากรอกชื่อจี้");

  const description = String(formData.get("description") ?? "").trim() || null;
  const price = parsePrice(formData.get("price"));

  const group = await ensurePendantOptionGroup(workshopId);
  const sortOrder = await prisma.workshopOption.count({ where: { groupId: group.id } });

  const option = await prisma.workshopOption.create({
    data: {
      groupId: group.id,
      label,
      description,
      price,
      sortOrder,
    },
  });

  const imageFile = getFormDataFile(formData, "image");
  if (imageFile) {
    await saveWorkshopOptionImage(workshopId, option.id, imageFile);
  }

  const saved = await prisma.workshopOption.findUnique({ where: { id: option.id } });

  revalidateWorkshopPaths(workshopId);
  revalidatePath(`/admin/workshops/${workshopId}`);

  return saved ?? option;
}

export async function updateWorkshopPendantRecord(optionId: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  if (!label) throw new Error("กรุณากรอกชื่อจี้");

  const description = String(formData.get("description") ?? "").trim() || null;
  const price = parsePrice(formData.get("price"));

  const option = await prisma.workshopOption.findFirst({
    where: { id: optionId, group: { groupType: "ADDON" } },
    include: { group: true },
  });
  if (!option) throw new Error("ไม่พบรายการจี้");

  const updated = await prisma.workshopOption.update({
    where: { id: optionId },
    data: { label, description, price },
  });

  const imageFile = getFormDataFile(formData, "image");
  if (imageFile) {
    await saveWorkshopOptionImage(option.group.workshopId, optionId, imageFile);
  }

  const saved = await prisma.workshopOption.findUnique({ where: { id: optionId } });

  revalidateWorkshopPaths(option.group.workshopId);
  revalidatePath(`/admin/workshops/${option.group.workshopId}`);

  return saved ?? updated;
}

export async function deleteWorkshopPendantRecord(optionId: string) {
  const option = await prisma.workshopOption.findFirst({
    where: { id: optionId, group: { groupType: "ADDON" } },
    include: { group: true },
  });
  if (!option) throw new Error("ไม่พบรายการจี้");

  await prisma.workshopOption.delete({ where: { id: optionId } });

  revalidateWorkshopPaths(option.group.workshopId);
  revalidatePath(`/admin/workshops/${option.group.workshopId}`);
}
