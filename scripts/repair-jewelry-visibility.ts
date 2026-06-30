import { prisma } from "../src/lib/prisma";

/**
 * Products created while the isActive checkbox bug existed were saved as inactive
 * even when "เปิดใช้งานบนหน้าร้าน" was checked. Re-activate those with images
 * in active categories.
 */
async function main() {
  const result = await prisma.jewelryProduct.updateMany({
    where: {
      isActive: false,
      images: { some: {} },
      category: { isActive: true },
    },
    data: { isActive: true },
  });

  console.log(`Activated ${result.count} jewelry product(s) for storefront display.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
