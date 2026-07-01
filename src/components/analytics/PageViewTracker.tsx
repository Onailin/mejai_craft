"use client";

import { useEffect } from "react";

export function PageViewTracker() {
  useEffect(() => {
    fetch("/api/analytics/visit", { method: "POST", keepalive: true }).catch(() => undefined);
  }, []);

  return null;
}
