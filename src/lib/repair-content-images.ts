import { prisma } from "@/lib/prisma";
import { isDisplayableImageUrl, isLocalDevOnlyImageUrl } from "@/lib/image-urls";

let repairPromise: Promise<void> | null = null;

export async function repairJewelryProductImages(productId: string) {
  const images = await prisma.jewelryProductImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });

  if (images.length === 0) return;

  const displayable = images.filter((image) => isDisplayableImageUrl(image.imageUrl));
  const brokenLocal = images.filter((image) => isLocalDevOnlyImageUrl(image.imageUrl));

  if (displayable.length > 0 && brokenLocal.length > 0) {
    await prisma.jewelryProductImage.deleteMany({
      where: { id: { in: brokenLocal.map((image) => image.id) } },
    });
  }

  const remaining = await prisma.jewelryProductImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });

  if (remaining.length === 0) return;

  const primary = remaining.find((image) => image.isPrimary);
  if (primary && isDisplayableImageUrl(primary.imageUrl)) {
    return;
  }

  const best = remaining.find((image) => isDisplayableImageUrl(image.imageUrl)) ?? remaining[0];

  await prisma.jewelryProductImage.updateMany({
    where: { productId },
    data: { isPrimary: false },
  });

  await prisma.jewelryProductImage.update({
    where: { id: best.id },
    data: { isPrimary: true, sortOrder: 0 },
  });
}

export async function repairAllJewelryProductImages() {
  const products = await prisma.jewelryProduct.findMany({ select: { id: true } });

  for (const product of products) {
    await repairJewelryProductImages(product.id);
  }
}

export function ensureContentImagesRepaired() {
  if (repairPromise) return repairPromise;
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Promise.resolve();
  }

  repairPromise = repairAllJewelryProductImages()
    .catch((error) => {
      console.error("[repair-content-images]", error);
      repairPromise = null;
    })
    .then(() => undefined);

  return repairPromise;
}
