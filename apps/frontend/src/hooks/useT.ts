// src/hooks/useT.ts
import { useTranslations } from "next-intl";

/**
 * useT('Namespace') returns a hook that translates keys within that namespace.
 */
export function useT(namespace: string) {
  return useTranslations(namespace);
}
