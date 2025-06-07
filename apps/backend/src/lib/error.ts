import { MessageCodes } from "@monorepo/shared";

/**
 * Represents a detailed error for a specific field (optional).
 * If 'field' is not provided, it's considered a global error.
 */
interface ErrorDetail {
  field?: string;
  message: string;
}

/**
 * Parameters expected when generating a standardized error response.
 */
interface ErrorResponseParams {
  code: string; // A machine-readable error code
  message: string; // A human-readable error message
  details?: ErrorDetail[]; // Optional list of field-level or general errors
  showDetails?: boolean; // Flag to control whether to include 'details' in the response
}

/**
 * Builds a standardized error response object.
 * Used across the backend to ensure consistency when sending errors.
 */
export const createErrorResponse = ({
  code = MessageCodes.VALIDATION_ERROR,
  message,
  details = [],
  showDetails = true,
}: ErrorResponseParams) => {
  const error: Record<string, any> = {
    code,
    message,
  };

  // Only include detailed errors if enabled and present
  if (showDetails && details.length > 0) {
    error.details = details;
  }

  return { status: "error", error };
};

/**
 * Represents a single validation error.
 * 'field' is optional to allow general errors.
 */
type FieldError = { field?: string; message: string };

/**
 * Utility to collect validation errors across multiple fields.
 * This allows us to conditionally add errors based on logic,
 * and then send them all together in a consistent format.
 */
export const createValidationErrorCollector = () => {
  const errors: FieldError[] = [];

  /**
   * Adds an error conditionally.
   * If `condition` is provided, this is treated as a field-level validation.
   * If not, the first param is treated as a general error message.
   */
  const add = (
    fieldOrMessage: string,
    condition?: any,
    maybeMessage?: string
  ) => {
    if (typeof condition !== "undefined") {
      // Field-level error
      if (!condition) {
        errors.push({
          field: fieldOrMessage,
          message: maybeMessage || "This field is required.",
        });
      }
    } else {
      // General/global error
      errors.push({ message: fieldOrMessage });
    }
  };

  /**
   * Checks if any errors have been collected.
   */
  const hasErrors = () => errors.length > 0;

  /**
   * Returns all collected errors.
   */
  const get = () => errors;

  return { add, hasErrors, get };
};
