export type WorkshopFormState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export type WorkshopRingPricingState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export type WorkshopImageUploadResult =
  | { ok: true; imageUrl: string; id?: string }
  | { ok: false; error: string };
