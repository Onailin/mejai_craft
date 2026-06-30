export function getFormDataFiles(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .map((entry) => {
      if (!entry || typeof entry === "string") return null;

      if (entry instanceof File) {
        return entry.size > 0 ? entry : null;
      }

      const blob = entry as Blob;
      if (typeof blob.size !== "number" || blob.size === 0) return null;

      const name =
        "name" in blob && typeof (blob as File).name === "string"
          ? (blob as File).name
          : "upload.jpg";
      const type = blob.type || guessMimeType(name);
      return new File([blob], name, { type });
    })
    .filter((file): file is File => Boolean(file));
}

export function getFormDataFile(formData: FormData, key: string): File | null {
  const entry = formData.get(key);
  if (!entry || typeof entry === "string") return null;

  if (entry instanceof File) {
    return entry.size > 0 ? entry : null;
  }

  const blob = entry as Blob;
  if (typeof blob.size !== "number" || blob.size === 0) return null;

  const name =
    "name" in blob && typeof (blob as File).name === "string"
      ? (blob as File).name
      : "upload.jpg";
  const type = blob.type || guessMimeType(name);
  return new File([blob], name, { type });
}

function guessMimeType(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

/** Checkbox + hidden input pattern: getAll and prefer "true" when checked. */
export function getFormDataBoolean(formData: FormData, name: string, defaultValue = true): boolean {
  const values = formData.getAll(name);
  if (values.length === 0) return defaultValue;
  if (values.some((value) => value === "true" || value === "on")) return true;
  if (values.some((value) => value === "false" || value === "off")) return false;
  return defaultValue;
}
