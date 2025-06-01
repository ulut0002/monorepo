/**
 * Machine-readable error codes used across API responses.
 * These codes provide consistent identifiers for error types
 * that can be used by frontends or logging systems.
 */
export enum MessageCodes {
  /**
   * Generic validation failure (e.g. missing/invalid fields)
   */
  VALIDATION_ERROR = "VALIDATION_ERROR",

  /**
   * Required field is missing from input
   */
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  /**
   * JWT secret key is not configured or invalid
   */
  MISSING_SECURITY_KEY = "MISSING_SECURITY_KEY",

  /**
   * A specific field is required but was not provided
   */
  REQUIRED_FIELD = "REQUIRED_FIELD",

  /**
   * Email format is invalid
   */
  INVALID_EMAIL = "INVALID_EMAIL",

  /**
   * Password doesn't meet security rules
   */
  INVALID_PASSWORD = "INVALID_PASSWORD",

  /**
   * A user with the same username or email already exists
   */
  EXISTING_USER = "EXISTING_USER",

  /**
   * Authentication failed due to invalid credentials
   */
  AUTH_FAILED = "AUTH_FAILED",

  /**
   * Generic server-side error
   */
  SERVER_ERROR = "SERVER_ERROR",

  /**
   * Requested resource was not found
   */
  NOT_FOUND = "NOT_FOUND",
}
