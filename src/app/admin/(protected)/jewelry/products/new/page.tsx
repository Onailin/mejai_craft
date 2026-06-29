import { prisma } from "@/lib/prisma";
import { createJewelryProductFormAction } from "@/actions/admin";
import { JewelryProductForm } from "@/components/admin/JewelryProductForm";

export const dynamic = "force-dynamic";

export default async function AdminJewelryProductNewPage() {
  const categories = await prisma.jewelryCategory.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <JewelryProductForm
      categories={categories}
      action={createJewelryProductFormAction}
      pageTitle="เพิ่มสินค้าใหม่"
      pageDescription="กรอกข้อมูลสินค้า อัปโหลดรูป หรือวางลิงก์รูปภาพ"
      submitLabel="บันทึกสินค้า"
    />
  );
}
