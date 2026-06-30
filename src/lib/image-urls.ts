export function isLocalDevOnlyImageUrl(url: string | null | undefined) {
  return Boolean(url?.startsWith("/uploads/"));
}

export function isDisplayableImageUrl(url: string | null | undefined) {
  if (!url) return false;
  if (isLocalDevOnlyImageUrl(url)) return false;
  return true;
}

export function orderProductImagesForDisplay<T extends { imageUrl: string; isPrimary: boolean }>(
  images: T[]
): T[] {
  const displayable = images.filter((image) => isDisplayableImageUrl(image.imageUrl));
  if (displayable.length === 0) return images;

  const primary = displayable.find((image) => image.isPrimary) ?? displayable[0];
  const rest = displayable.filter((image) => image !== primary);

  return [primary, ...rest];
}

export function pickProductCoverImage(
  images: Array<{ imageUrl: string; isPrimary: boolean }>
): string | undefined {
  return orderProductImagesForDisplay(images)[0]?.imageUrl;
}

export function getDisplayableProductImages<T extends { imageUrl: string; isPrimary: boolean }>(
  images: T[]
): T[] {
  const ordered = orderProductImagesForDisplay(images);
  const displayable = ordered.filter((image) => isDisplayableImageUrl(image.imageUrl));
  return displayable.length > 0 ? displayable : ordered;
}
