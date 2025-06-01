/**
 * Options for email normalization.
 * - stripPlusAliases: removes `+alias` suffixes from the local part of emails (default: true)
 */
type NormalizeOptions = {
  stripPlusAliases?: boolean; // applies to supported providers
};

/**
 * Normalize an email address according to provider-specific rules.
 *
 * This function handles:
 * - Lowercasing the email
 * - Removing dots from Gmail addresses
 * - Stripping `+` aliases for supported providers
 * - Unifying Google domains (e.g., googlemail.com → gmail.com)
 * - Returning `null` if the input is not a valid email format
 */
export function normalizeEmail(
  email: string,
  options?: NormalizeOptions
): string | null {
  // Step 1: Clean and validate
  email = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return null;

  // Step 2: Extract local and domain parts
  const [rawLocal, rawDomain] = email.split("@");
  const domain = rawDomain.toLowerCase();
  const stripPlus = options?.stripPlusAliases ?? true;

  let local = rawLocal;

  // Step 3: Normalize based on provider-specific rules
  switch (domain) {
    case "gmail.com":
    case "googlemail.com":
      local = local.replace(/\./g, ""); // Remove dots for Gmail
      if (stripPlus) {
        local = local.split("+")[0]; // Remove +alias
      }
      return `${local}@gmail.com`; // Normalize domain
    case "outlook.com":
    case "hotmail.com":
    case "live.com":
    case "icloud.com":
    case "protonmail.com":
    case "proton.me":
      if (stripPlus) {
        local = local.split("+")[0];
      }
      return `${local}@${domain}`; // Keep original domain
    default:
      // For unknown providers: apply basic normalization
      return `${local}@${domain}`;
  }
}
