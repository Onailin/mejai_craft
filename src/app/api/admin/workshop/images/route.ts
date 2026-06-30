import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { getFormDataFile } from "@/lib/form-data-file";
import { revalidateWorkshopPaths } from "@/lib/revalidate-workshop";
import {
  saveWorkshopAddonImage,
  saveWorkshopBannerImage,
  saveWorkshopFeaturedImage,
  saveWorkshopOptionImage,
  saveWorkshopRingSampleImage,
} from "@/lib/workshop-image-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "อัปโหลดรูปไม่สำเร็จ";
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const workshopId = String(formData.get("workshopId") ?? "").trim();
    const kind = String(formData.get("kind") ?? "").trim();
    const file = getFormDataFile(formData, "file");

    if (!workshopId) {
      return NextResponse.json({ error: "ไม่พบเวิร์คชอป" }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "กรุณาเลือกรูป" }, { status: 400 });
    }

    let imageUrl: string;
    let imageId: string | undefined;

    if (kind === "sample") {
      const sampleType = String(formData.get("sampleType") ?? "").trim();
      if (!sampleType) {
        return NextResponse.json({ error: "ไม่พบประเภทรูป" }, { status: 400 });
      }
      imageUrl = await saveWorkshopRingSampleImage(workshopId, sampleType, file);
    } else if (kind === "addon") {
      const addonType = String(formData.get("addonType") ?? "").trim();
      if (!addonType) {
        return NextResponse.json({ error: "ไม่พบประเภทบริการ" }, { status: 400 });
      }
      imageUrl = await saveWorkshopAddonImage(workshopId, addonType, file);
    } else if (kind === "option") {
      const optionId = String(formData.get("optionId") ?? "").trim();
      if (!optionId) {
        return NextResponse.json({ error: "ไม่พบตัวเลือก" }, { status: 400 });
      }
      imageUrl = await saveWorkshopOptionImage(workshopId, optionId, file);
    } else if (kind === "featured") {
      const saved = await saveWorkshopFeaturedImage(workshopId, file);
      imageUrl = saved.imageUrl;
      imageId = saved.id;
    } else if (kind === "banner") {
      const saved = await saveWorkshopBannerImage(workshopId, file);
      imageUrl = saved.imageUrl;
      imageId = saved.id;
    } else {
      return NextResponse.json({ error: "ประเภทการอัปโหลดไม่ถูกต้อง" }, { status: 400 });
    }

    revalidateWorkshopPaths(workshopId);
    return NextResponse.json({ ok: true, imageUrl, id: imageId });
  } catch (error) {
    return NextResponse.json({ error: formatError(error) }, { status: 500 });
  }
}
