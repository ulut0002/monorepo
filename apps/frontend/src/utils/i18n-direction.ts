// src/utils/i18n-direction.ts
export function getDirection(locale: string): "ltr" | "rtl" {
  return ["ar", "he", "fa", "ur"].includes(locale) ? "rtl" : "ltr";
}
