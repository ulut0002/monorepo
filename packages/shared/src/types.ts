export interface User {
  id: string;
  name: string;
  email: string;
}
interface INewUser {
  email: string;
  password: string;
  username: string;
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
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  allowUnderscore?: boolean;
  allowDot?: boolean;
  allowHyphen?: boolean;
  noLeadingTrailingSymbols?: boolean;
  noConsecutiveSymbols?: boolean;
};

type EnvConfig = Partial<{
  BACKEND_HOST: string; // e.g. localhost
  BACKEND_PORT: string; // e.g. 3000
  BACKEND_MONGODB_URI: string; // e.g. mongodb://localhost:27017/mydb
  BACKEND_SECRET_KEY: string; // e.g. a long random string for JWT signing

  COOKIE_NAME: string; // e.g. sessionId
  COOKIE_DOMAIN: string; // e.g. localhost
}>;

export {
  NormalizeOptions,
  PasswordValidationConfig,
  UsernameValidationConfig,
  EnvConfig,
  INewUser,
};
