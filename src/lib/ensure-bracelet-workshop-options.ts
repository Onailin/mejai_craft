import {
  ensurePendantOptionGroup,
  removeLegacyBraceletStoneOptions,
  removeLegacyPendantTemplates,
} from "@/lib/workshop-pendant-admin-service";

/** ใช้ตอนโหลดหน้าเว็บ — สร้างกลุ่มจี้ถ้ายังไม่มี */
export async function ensureBraceletWorkshopPublicOptions(workshopId: string) {
  await ensurePendantOptionGroup(workshopId);
}

/** ใช้ตอนเปิดหน้าแอดมิน — ลบเทมเพลตเก่าและข้อมูลซ้ำ */
export async function ensureBraceletWorkshopOptions(workshopId: string) {
  await ensurePendantOptionGroup(workshopId);
  await removeLegacyPendantTemplates(workshopId);
  await removeLegacyBraceletStoneOptions(workshopId);
}
