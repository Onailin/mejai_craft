export function isLegacyPendantDescription(description: string | null | undefined) {
  return Boolean(description?.startsWith("PENDANT:"));
}

export function displayPendantDescription(description: string | null | undefined) {
  if (!description || isLegacyPendantDescription(description)) return "";
  return description;
}
