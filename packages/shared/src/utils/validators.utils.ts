// ---------- VALIDATORS ----------

import {
  NormalizeOptions,
  PasswordValidationConfig,
  UsernameValidationConfig,
} from "@shared/types/config.types";

/**
 * Validates if an email is in a generally acceptable format.
 * This uses a simplified RFC-style regex.
 */
function isValidEmail(email: string): boolean {
  email = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength using configurable rules.
 *
 * @param password - The input password string.
 * @param config - Optional rules for password complexity.
 *
 * Rules include:
 * - min/max length
 * - uppercase / lowercase / number / symbol requirements
 */
function isValidPassword(
  password: string,
  config?: PasswordValidationConfig
): boolean {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSymbols = true,
  } = config || {};

  if (password.length < minLength || password.length > maxLength) return false;
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  if (requireNumbers && !/[0-9]/.test(password)) return false;
  if (requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

  return true;
}

/**
 * Validates a username string with flexibility over allowed characters and formatting rules.
 *
 * @param username - The input username.
 * @param config - Optional customization for formatting constraints.
 *
 * Options include:
 * - allowed characters (dot, underscore, hyphen)
 * - minimum and maximum length
 * - disallow leading/trailing/consecutive symbols
 */
function isValidUsername(
  username: string,
  config?: UsernameValidationConfig
): boolean {
  const {
    minLength = 3,
    maxLength = 30,
    allowUnderscore = true,
    allowDot = true,
    allowHyphen = false,
    noLeadingTrailingSymbols = true,
    noConsecutiveSymbols = true,
  } = config || {};

  // Length check
  if (username.length < minLength || username.length > maxLength) {
    return false;
  }

  // Dynamically build regex based on allowed characters
  let allowedChars = "a-zA-Z0-9";
  if (allowUnderscore) allowedChars += "_";
  if (allowDot) allowedChars += ".";
  if (allowHyphen) allowedChars += "-";

  // Regex to validate allowed characters
  const validCharsRegex = new RegExp(`^[${allowedChars}]+$`);
  if (!validCharsRegex.test(username)) return false;

  // Optionally disallow usernames starting or ending with symbols
  if (noLeadingTrailingSymbols && /^[._-]|[._-]$/.test(username)) return false;

  // Optionally disallow consecutive symbols like "..", "__"
  if (noConsecutiveSymbols && /[._-]{2,}/.test(username)) return false;

  return true;
}

// ---------- NORMALIZER ----------

/**
 * Normalizes an email address for consistent user identity matching.
 *
 * - Lowercases the address
 * - For Gmail: strips dots and +aliases
 * - For supported providers: strips +aliases
 * - Returns null if not a valid email
 *
 * Use this to deduplicate user signups across email aliasing tricks.
 */
function normalizeEmail(
  email: string,
  options?: NormalizeOptions
): string | null {
  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) return null;

  const [rawLocal, rawDomain] = email.split("@");
  const domain = rawDomain.toLowerCase();
  const stripPlus = options?.stripPlusAliases ?? true;

  let local = rawLocal;

  switch (domain) {
    case "gmail.com":
    case "googlemail.com":
      local = local.replace(/\./g, ""); // Remove all dots from Gmail username
      if (stripPlus) {
        local = local.split("+")[0]; // Remove alias
      }
      return `${local}@gmail.com`; // Normalize domain to gmail.com

    case "outlook.com":
    case "hotmail.com":
    case "live.com":
    case "icloud.com":
    case "protonmail.com":
    case "proton.me":
      if (stripPlus) {
        local = local.split("+")[0];
      }
      return `${local}@${domain}`; // Preserve original domain

    default:
      // For unknown providers, only lowercase is enforced
      return `${local}@${domain}`;
  }
}

// ---------- EXPORTS ----------

export { isValidEmail, isValidPassword, isValidUsername, normalizeEmail };
