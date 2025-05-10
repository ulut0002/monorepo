export interface User {
  id: string;
  name: string;
  email: string;
}
/**
 * Options for normalizing email addresses.
 */
type NormalizeOptions = {
  stripPlusAliases?: boolean; // Applies to supported providers only
};

/**
 * Configuration for validating passwords.
 */
type PasswordValidationConfig = {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSymbols?: boolean;
};

/**
 * Configuration for validating usernames.
 */
type UsernameValidationConfig = {
  minLength?: number;
  maxLength?: number;
  allowUnderscore?: boolean;
  allowDot?: boolean;
  allowHyphen?: boolean;
  noLeadingTrailingSymbols?: boolean;
  noConsecutiveSymbols?: boolean;
};

type EnvConfig = Partial<{
  BACKEND_PORT: string;
  BACKEND_MONGODB_URI: string;
  BACKEND_SECRET_KEY: string;

  COOKIE_NAME: string;
  COOKIE_DOMAIN: string;
}>;

export {
  NormalizeOptions,
  PasswordValidationConfig,
  UsernameValidationConfig,
  EnvConfig,
};
