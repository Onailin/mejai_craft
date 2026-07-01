type LuckyStoneSaveResult =
  | { ok: true; id: string; imageUrl: string }
  | { ok: false; error: string };

async function parseResponse(response: Response): Promise<LuckyStoneSaveResult> {
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; id?: string; imageUrl?: string; error?: string }
    | null;

  if (!response.ok || !payload?.id || !payload.imageUrl) {
    return { ok: false, error: payload?.error ?? "บันทึกไม่สำเร็จ" };
  }

  return {
    ok: true,
    id: payload.id,
    imageUrl: payload.imageUrl,
  };
}

export async function createLuckyStoneViaApi(formData: FormData): Promise<LuckyStoneSaveResult> {
  const response = await fetch("/api/admin/lucky-stones", {
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

export async function updateLuckyStoneViaApi(
  id: string,
  formData: FormData
): Promise<LuckyStoneSaveResult> {
  const response = await fetch(`/api/admin/lucky-stones/${id}`, {
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
