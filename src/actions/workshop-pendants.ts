"use server";

import { requireEditorOrAdmin } from "@/lib/auth-helpers";
import { formatActionError } from "@/lib/format-action-error";
import {
  createWorkshopPendantRecord,
  deleteWorkshopPendantRecord,
  updateWorkshopPendantRecord,
} from "@/lib/workshop-pendant-admin-service";

export async function createWorkshopPendantAction(workshopId: string, formData: FormData) {
  try {
    await requireEditorOrAdmin();
    await createWorkshopPendantRecord(workshopId, formData);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: formatActionError(error) };
  }
}

export async function updateWorkshopPendantAction(optionId: string, formData: FormData) {
  try {
    await requireEditorOrAdmin();
    await updateWorkshopPendantRecord(optionId, formData);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: formatActionError(error) };
  }
}

export async function deleteWorkshopPendantAction(optionId: string) {
  try {
    await requireEditorOrAdmin();
    await deleteWorkshopPendantRecord(optionId);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: formatActionError(error) };
  }
}

export async function deleteWorkshopPendantFormAction(optionId: string) {
  await requireEditorOrAdmin();
  await deleteWorkshopPendantRecord(optionId);
}
