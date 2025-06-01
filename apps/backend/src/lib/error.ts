import { MessageCodes } from "@shared/constants/message.codes";

interface ErrorDetail {
  field?: string;
  message: string;
}

interface ErrorResponseParams {
  code: string;
  message: string;
  details?: ErrorDetail[];
  showDetails?: boolean;
}

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

  if (showDetails && details.length > 0) {
    error.details = details;
  }

  return { status: "error", error };
};
type FieldError = { field?: string; message: string };

export const createValidationErrorCollector = () => {
  const errors: FieldError[] = [];

  const add = (
    fieldOrMessage: string,
    condition?: any,
    maybeMessage?: string
  ) => {
    // field-level error
    if (typeof condition !== "undefined") {
      if (!condition) {
        errors.push({
          field: fieldOrMessage,
          message: maybeMessage || "This field is required.",
        });
      }
    } else {
      // general/global error
      errors.push({ message: fieldOrMessage });
    }
  };

  const hasErrors = () => errors.length > 0;

  const get = () => errors;

  return { add, hasErrors, get };
};
