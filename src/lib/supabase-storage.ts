import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("ยังไม่ได้ตั้งค่า Supabase");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "mejai-assets";
}

function usesRemoteDatabase() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  return databaseUrl.includes("supabase.co") || databaseUrl.includes("supabase.com");
}

function requiresCloudStorage() {
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  return isProduction || usesRemoteDatabase();
}

function getExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function normalizeMimeType(file: File): File {
  if (file.type && ALLOWED_TYPES.has(file.type)) {
    const type = file.type === "image/jpg" ? "image/jpeg" : file.type;
    if (type === file.type) return file;
    return new File([file], file.name || "upload.jpg", { type });
  }

  const lower = (file.name || "").toLowerCase();
  let type = "image/jpeg";
  if (lower.endsWith(".png")) type = "image/png";
  else if (lower.endsWith(".webp")) type = "image/webp";

  return new File([file], file.name || "upload.jpg", { type });
}

export function validateImageFile(file: File) {
  const mime = file.type === "image/jpg" ? "image/jpeg" : file.type;
  if (!ALLOWED_TYPES.has(mime)) {
    throw new Error("รองรับเฉพาะไฟล์ JPEG, PNG หรือ WebP");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("รูปต้องไม่เกิน 5 MB");
  }
}

async function uploadImageLocal(file: File, folder: string) {
  const ext = getExtension(file.type);
  const safeName = `${randomUUID()}.${ext}`;
  const relativeDir = path.join("uploads", folder);
  const absDir = path.join(process.cwd(), "public", relativeDir);
  await mkdir(absDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absDir, safeName), buffer);
  const publicUrl = `/${relativeDir.replace(/\\/g, "/")}/${safeName}`;
  return { path: publicUrl.slice(1), publicUrl };
}

async function uploadImageSupabase(file: File, folder: string) {
  const supabase = getSupabaseAdmin();
  const bucket = getBucket();
  const ext = getExtension(file.type);
  const safeName = `${randomUUID()}.${ext}`;
  const storagePath = `${folder}/${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return { path: storagePath, publicUrl: data.publicUrl };
}

export async function uploadImage(
  file: File,
  folder: string
): Promise<{ path: string; publicUrl: string }> {
  const normalized = normalizeMimeType(file);
  validateImageFile(normalized);

  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const cloudStorageRequired = requiresCloudStorage();

  if (!hasSupabase) {
    if (cloudStorageRequired) {
      throw new Error(
        "ต้องตั้งค่า SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY เมื่อใช้ database บน cloud หรือ deploy production"
      );
    }
    return uploadImageLocal(normalized, folder);
  }

  try {
    return await uploadImageSupabase(normalized, folder);
  } catch (error) {
    if (cloudStorageRequired) {
      throw error;
    }
    console.error("Supabase upload failed, falling back to local storage:", error);
    return uploadImageLocal(normalized, folder);
  }
}

export async function deleteImageIfUnused(
  imageUrl: string,
  isStillUsed: () => Promise<boolean>
) {
  if (!imageUrl.includes("supabase.co/storage") && !imageUrl.startsWith("/uploads/")) return;

  const stillUsed = await isStillUsed();
  if (stillUsed) return;

  if (imageUrl.startsWith("/uploads/")) {
    const { unlink } = await import("fs/promises");
    const absPath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
    await unlink(absPath).catch(() => undefined);
    return;
  }

  const supabase = getSupabaseAdmin();
  const bucket = getBucket();
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = imageUrl.indexOf(marker);
  if (index === -1) return;

  const storagePath = imageUrl.slice(index + marker.length);
  await supabase.storage.from(bucket).remove([storagePath]);
}
