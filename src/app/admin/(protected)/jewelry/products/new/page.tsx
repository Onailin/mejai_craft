import { prisma } from "@/lib/prisma";
import { JewelryProductForm } from "@/components/admin/JewelryProductForm";

export const dynamic = "force-dynamic";

export default async function AdminJewelryProductNewPage() {
  const categories = await prisma.jewelryCategory.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, isActive: true },
  });

  return (
    <JewelryProductForm
      categories={categories.map((category) => ({
        id: category.id,
        name: category.isActive ? category.name : `${category.name} (หมวดปิดอยู่)`,
      }))}
      pageTitle="เพิ่มสินค้าใหม่"
      pageDescription="กรอกข้อมูลสินค้าและอัปโหลดรูปภาพ"
      submitLabel="บันทึกสินค้า"
    />
  );
}
