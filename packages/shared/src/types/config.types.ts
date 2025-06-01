type EnvConfig = Partial<{
  BACKEND_URL: string; // e.g. localhost
  BACKEND_PORT: string; // e.g. 3000
  BACKEND_MONGODB_URI: string; // e.g. mongodb://localhost:27017/dbName
  BACKEND_JWT_SECRET_KEY: string; // e.g. a long random string for JWT signing
}>;

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
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  allowUnderscore?: boolean;
  allowDot?: boolean;
  allowHyphen?: boolean;
  noLeadingTrailingSymbols?: boolean;
  noConsecutiveSymbols?: boolean;
};

export {
  EnvConfig,
  NormalizeOptions,
  PasswordValidationConfig,
  UsernameValidationConfig,
};
