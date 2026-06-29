"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import type { WorkshopFormState } from "@/actions/admin";

type WorkshopGeneralFormProps = {
  workshopId: string;
  title: string;
  summary: string;
  featuredTitle: string;
  featuredSubtitle: string;
  action: (prevState: WorkshopFormState, formData: FormData) => Promise<WorkshopFormState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-stone-900 px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "กำลังบันทึก..." : "บันทึกข้อมูลทั่วไป"}
    </button>
  );
}

export function WorkshopGeneralForm({
  workshopId,
  title,
  summary,
  featuredTitle,
  featuredSubtitle,
  action,
}: WorkshopGeneralFormProps) {
  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2"
    >
      <h2 className="text-lg font-medium text-stone-800 md:col-span-2">ข้อมูลทั่วไป</h2>

      {state.error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 md:col-span-2">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 md:col-span-2">
          {state.message ?? "บันทึกข้อมูลเวิร์คชอปเรียบร้อยแล้ว"}
        </div>
      ) : null}

      <label className="space-y-1 md:col-span-2">
        <span className="text-sm text-stone-600">ชื่อเวิร์คชอป</span>
        <input
          name="title"
          defaultValue={title}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </label>
      <label className="space-y-1 md:col-span-2">
        <span className="text-sm text-stone-600">สรุป</span>
        <textarea
          name="summary"
          defaultValue={summary}
          className="w-full rounded-lg border border-stone-300 px-3 py-2"
          rows={3}
        />
      </label>
      <input type="hidden" name="featuredTitle" defaultValue={featuredTitle} />
      <input type="hidden" name="featuredSubtitle" defaultValue={featuredSubtitle} />
      <input type="hidden" name="workshopId" value={workshopId} />

      <div className="md:col-span-2">
        <SubmitButton />
      </div>
    </form>
  );
}
