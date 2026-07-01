import { z } from "zod";

export function formatActionError(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.errors.map((issue) => issue.message).join(" · ");
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}
