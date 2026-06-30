type JewelryProductSaveResult =
  | { ok: true; id: string; message: string }
  | { ok: false; error: string };

async function parseResponse(response: Response): Promise<JewelryProductSaveResult> {
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; id?: string; message?: string; error?: string }
    | null;

  if (!response.ok || !payload?.id) {
    return { ok: false, error: payload?.error ?? "บันทึกไม่สำเร็จ" };
  }

  return {
    ok: true,
    id: payload.id,
    message: payload.message ?? "บันทึกเรียบร้อยแล้ว",
  };
}

export async function createJewelryProductViaApi(
  formData: FormData
): Promise<JewelryProductSaveResult> {
  const response = await fetch("/api/admin/jewelry/products", {
    method: "POST",
    body: formData,
  }).catch(() => null);

  if (!response) {
    return {
      ok: false,
      error: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณารีเฟรชหน้าแล้วลองใหม่",
    };
  }

  return parseResponse(response);
}

export async function updateJewelryProductViaApi(
  id: string,
  formData: FormData
): Promise<JewelryProductSaveResult> {
  const response = await fetch(`/api/admin/jewelry/products/${id}`, {
    method: "POST",
    body: formData,
  }).catch(() => null);

  if (!response) {
    return {
      ok: false,
      error: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณารีเฟรชหน้าแล้วลองใหม่",
    };
  }

  return parseResponse(response);
}
