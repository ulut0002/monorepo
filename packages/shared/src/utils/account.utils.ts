type NormalizeOptions = {
  stripPlusAliases?: boolean; // applies to supported providers
};

/**
 * Normalize an email address according to provider-specific rules.
 */
export function normalizeEmail(
  email: string,
  options?: NormalizeOptions
): string | null {
  email = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return null;

  const [rawLocal, rawDomain] = email.split("@");
  const domain = rawDomain.toLowerCase();
  const stripPlus = options?.stripPlusAliases ?? true;

  let local = rawLocal;

  switch (domain) {
    case "gmail.com":
    case "googlemail.com":
      local = local.replace(/\./g, ""); // remove dots
      if (stripPlus) {
        local = local.split("+")[0]; // strip plus alias
      }
      return `${local}@gmail.com`; // unify googlemail -> gmail
    case "outlook.com":
    case "hotmail.com":
    case "live.com":
      if (stripPlus) {
        local = local.split("+")[0];
      }
      return `${local}@${domain}`;
    case "icloud.com":
      if (stripPlus) {
        local = local.split("+")[0];
      }
      return `${local}@${domain}`;
    case "protonmail.com":
    case "proton.me":
      if (stripPlus) {
        local = local.split("+")[0];
      }
      return `${local}@${domain}`;
    default:
      // Unknown provider: lowercase only
      return `${local}@${domain}`;
  }
}
