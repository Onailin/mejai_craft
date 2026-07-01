type PendantSaveResult =
  | { ok: true; id: string; imageUrl: string | null }
  | { ok: false; error: string };

async function parseResponse(response: Response): Promise<PendantSaveResult> {
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

export async function createWorkshopPendantViaApi(
  workshopId: string,
  formData: FormData
): Promise<PendantSaveResult> {
  const response = await fetch(`/api/admin/workshops/${workshopId}/pendants`, {
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

type PendantUpdateResult = { ok: true; imageUrl: string | null } | { ok: false; error: string };

async function parseUpdateResponse(response: Response): Promise<PendantUpdateResult> {
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; imageUrl?: string | null; error?: string }
    | null;

  if (!response.ok) {
    return { ok: false, error: payload?.error ?? "บันทึกไม่สำเร็จ" };
  }

  return { ok: true, imageUrl: payload?.imageUrl ?? null };
}

export async function updateWorkshopPendantViaApi(
  workshopId: string,
  optionId: string,
  formData: FormData
): Promise<PendantUpdateResult> {
  const response = await fetch(`/api/admin/workshops/${workshopId}/pendants/${optionId}`, {
    method: "POST",
    body: formData,
  }).catch(() => null);

  if (!response) {
    return {
      ok: false,
      error: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณารีเฟรชหน้าแล้วลองใหม่",
    };
  }

  return parseUpdateResponse(response);
}
