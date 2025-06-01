// ---------- VALIDATORS ----------

import {
  NormalizeOptions,
  PasswordValidationConfig,
  UsernameValidationConfig,
} from "@shared/types/config.types";

/**
 * Validates an email address using a basic RFC-like regex.
 */
function isValidEmail(email: string): boolean {
  email = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password based on the provided configuration.
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
 * Validates a username based on common industry rules and optional configuration.
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

  // Build allowed character set dynamically
  let allowedChars = "a-zA-Z0-9";
  if (allowUnderscore) allowedChars += "_";
  if (allowDot) allowedChars += ".";
  if (allowHyphen) allowedChars += "-";

  // General character validation
  const validCharsRegex = new RegExp(`^[${allowedChars}]+$`);
  if (!validCharsRegex.test(username)) return false;

  // Check for leading/trailing symbols
  if (noLeadingTrailingSymbols && /^[._-]|[._-]$/.test(username)) return false;

  // Check for consecutive symbols
  if (noConsecutiveSymbols && /[._-]{2,}/.test(username)) return false;

  return true;
}

// ---------- NORMALIZER ----------

/**
 * Normalizes an email address by:
 * - Lowercasing
 * - Removing dots for Gmail
 * - Stripping + aliases for supported providers
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
      local = local.replace(/\./g, ""); // remove dots
      if (stripPlus) {
        local = local.split("+")[0]; // strip plus alias
      }
      return `${local}@gmail.com`; // unify googlemail -> gmail

    case "outlook.com":
    case "hotmail.com":
    case "live.com":
    case "icloud.com":
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

// ---------- EXPORTS ----------

export { isValidEmail, isValidPassword, isValidUsername, normalizeEmail };
