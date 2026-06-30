type BirthstoneSaveResult =
  | { ok: true; id: string; imageUrl: string | null }
  | { ok: false; error: string };

async function parseResponse(response: Response): Promise<BirthstoneSaveResult> {
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; id?: string; imageUrl?: string | null; error?: string }
    | null;

  if (!response.ok || !payload?.id) {
    return { ok: false, error: payload?.error ?? "บันทึกไม่สำเร็จ" };
  }

  return {
    ok: true,
    id: payload.id,
    imageUrl: payload.imageUrl ?? null,
  };
}

export async function createBirthstoneViaApi(formData: FormData): Promise<BirthstoneSaveResult> {
  const response = await fetch("/api/admin/birthstones", {
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

export async function updateBirthstoneViaApi(
  id: string,
  formData: FormData
): Promise<BirthstoneSaveResult> {
  const response = await fetch(`/api/admin/birthstones/${id}`, {
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
