export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
  excludeSlug?: string
): Promise<string> {
  let slug = slugify(base) || "item";
  let counter = 1;

  while (await exists(slug) && slug !== excludeSlug) {
    slug = `${slugify(base)}-${counter}`;
    counter += 1;
  }

  return slug;
}
