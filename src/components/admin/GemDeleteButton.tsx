"use client";

type Props = {
  deleteAction: () => void;
  label?: string;
  className?: string;
};

export function GemDeleteButton({
  deleteAction,
  label = "ลบ",
  className = "rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50",
}: Props) {
  return (
    <form
      action={deleteAction}
      onSubmit={(event) => {
        if (!confirm("ยืนยันการลบรายการนี้?")) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
