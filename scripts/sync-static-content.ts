import { execSync } from "node:child_process";
import { migrateImagesToStorage } from "../src/lib/migrate-images-to-storage";

async function main() {
  const seedOnly = process.argv.includes("--seed-only");
  const imagesOnly = process.argv.includes("--images-only");

  if (!imagesOnly) {
    console.log("→ กำลัง seed ข้อมูล static ลง database...");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  }

  if (!seedOnly) {
    console.log("→ กำลังอัปโหลดรูปจาก public/ ขึ้น Supabase และอัปเดต URL ใน database...");
    const stats = await migrateImagesToStorage();
    console.log("เสร็จแล้ว:", stats);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
