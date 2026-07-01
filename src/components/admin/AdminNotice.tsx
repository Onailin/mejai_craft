"use client";

import { useEffect, type ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type NoticeVariant = "success" | "error" | "warning" | "info";

const VARIANT_STYLES: Record<
  NoticeVariant,
  {
    defaultTitle: string;
    Icon: typeof CheckCircle2;
    container: string;
    accent: string;
    iconWrap: string;
    title: string;
    message: string;
    dismiss: string;
  }
> = {
  success: {
    defaultTitle: "สำเร็จ",
    Icon: CheckCircle2,
    container:
      "border-emerald-200/90 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 shadow-[0_8px_30px_-12px_rgba(16,185,129,0.35)]",
    accent: "bg-emerald-500",
    iconWrap: "bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200/80",
    title: "text-emerald-950",
    message: "text-emerald-800/90",
    dismiss: "text-emerald-700 hover:bg-emerald-100/80",
  },
  error: {
    defaultTitle: "ไม่สำเร็จ",
    Icon: AlertCircle,
    container:
      "border-red-200/90 bg-gradient-to-br from-red-50 via-white to-red-50/40 shadow-[0_8px_30px_-12px_rgba(239,68,68,0.3)]",
    accent: "bg-red-500",
    iconWrap: "bg-red-100 text-red-600 ring-1 ring-red-200/80",
    title: "text-red-950",
    message: "text-red-800/90",
    dismiss: "text-red-700 hover:bg-red-100/80",
  },
  warning: {
    defaultTitle: "แจ้งเตือน",
    Icon: AlertTriangle,
    container:
      "border-amber-200/90 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 shadow-[0_8px_30px_-12px_rgba(245,158,11,0.28)]",
    accent: "bg-amber-500",
    iconWrap: "bg-amber-100 text-amber-700 ring-1 ring-amber-200/80",
    title: "text-amber-950",
    message: "text-amber-900/90",
    dismiss: "text-amber-700 hover:bg-amber-100/80",
  },
  info: {
    defaultTitle: "ข้อมูล",
    Icon: Info,
    container:
      "border-stone-200/90 bg-gradient-to-br from-stone-50 via-white to-stone-50/40 shadow-[0_8px_30px_-12px_rgba(120,113,108,0.22)]",
    accent: "bg-stone-500",
    iconWrap: "bg-stone-100 text-stone-600 ring-1 ring-stone-200/80",
    title: "text-stone-950",
    message: "text-stone-700/90",
    dismiss: "text-stone-600 hover:bg-stone-100/80",
  },
};

export type AdminNoticeProps = {
  variant: NoticeVariant;
  message: ReactNode;
  title?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
  className?: string;
};

export function AdminNotice({
  variant,
  message,
  title,
  onDismiss,
  autoDismissMs,
  className = "",
}: AdminNoticeProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = styles.Icon;
  const heading = title ?? styles.defaultTitle;

  useEffect(() => {
    if (!autoDismissMs || !onDismiss) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [autoDismissMs, onDismiss, message]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`admin-notice-in relative overflow-hidden rounded-2xl border px-4 py-3.5 sm:px-5 ${styles.container} ${className}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${styles.accent}`}
      />
      <div className="flex items-start gap-3 pl-1">
        <span
          className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.iconWrap}`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className={`text-sm font-semibold tracking-tight ${styles.title}`}>{heading}</p>
          <div className={`mt-0.5 text-sm leading-relaxed ${styles.message}`}>{message}</div>
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="ปิดการแจ้งเตือน"
            className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${styles.dismiss}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

type AdminNoticeStackProps = {
  error?: string | null;
  success?: string | null;
  warning?: ReactNode | null;
  onDismissError?: () => void;
  onDismissSuccess?: () => void;
  onDismissWarning?: () => void;
  errorTitle?: string;
  successTitle?: string;
  warningTitle?: string;
  successAutoDismissMs?: number;
  className?: string;
};

export function AdminNoticeStack({
  error,
  success,
  warning,
  onDismissError,
  onDismissSuccess,
  onDismissWarning,
  errorTitle,
  successTitle,
  warningTitle,
  successAutoDismissMs = 6000,
  className = "",
}: AdminNoticeStackProps) {
  if (!error && !success && !warning) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {error ? (
        <AdminNotice
          variant="error"
          title={errorTitle}
          message={error}
          onDismiss={onDismissError}
        />
      ) : null}
      {success ? (
        <AdminNotice
          variant="success"
          title={successTitle}
          message={success}
          onDismiss={onDismissSuccess}
          autoDismissMs={onDismissSuccess ? successAutoDismissMs : undefined}
        />
      ) : null}
      {warning ? (
        <AdminNotice
          variant="warning"
          title={warningTitle}
          message={warning}
          onDismiss={onDismissWarning}
        />
      ) : null}
    </div>
  );
}
