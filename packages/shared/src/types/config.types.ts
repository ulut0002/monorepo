/**
 * Partial environment config used throughout the backend app.
 * All values are read from `.env` files via dotenv and loaded into this shape.
 */
type EnvConfig = Partial<{
  BACKEND_URL: string; // Base URL for the backend server (e.g. http://localhost)
  BACKEND_PORT: string; // Port number backend listens on (e.g. 3000)
  BACKEND_MONGODB_URI: string; // MongoDB connection string
  BACKEND_JWT_SECRET_KEY: string; // Secret key used for signing JWTs
}>;

/**
 * Options for email normalization (e.g., used when checking for uniqueness).
 */
type NormalizeOptions = {
  stripPlusAliases?: boolean; // Removes "+alias" from Gmail-style addresses when true
};

/**
 * Configuration rules for password validation.
 * Useful for enforcing password strength policies during registration.
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
 * Configuration rules for username validation.
 * Use this to enforce constraints like length, allowed symbols, and formatting.
 */
type UsernameValidationConfig = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  allowUnderscore?: boolean;
  allowDot?: boolean;
  allowHyphen?: boolean;
  noLeadingTrailingSymbols?: boolean; // Disallow symbols at beginning/end
  noConsecutiveSymbols?: boolean; // Disallow repeating special characters
};

export type {
  EnvConfig,
  NormalizeOptions,
  PasswordValidationConfig,
  UsernameValidationConfig,
};
