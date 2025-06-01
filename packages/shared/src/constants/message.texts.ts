import { MessageCodes } from "./message.codes";

/**
 * Human-readable messages mapped to machine-readable error codes.
 * Used in API responses to provide consistent, user-friendly error messages.
 */
export const MessageTexts: Record<MessageCodes, string> = {
  [MessageCodes.VALIDATION_ERROR]: "Some input fields are invalid.",
  [MessageCodes.MISSING_REQUIRED_FIELD]: "A required field is missing.",
  [MessageCodes.MISSING_SECURITY_KEY]:
    "Security credentials are missing or invalid.",
  [MessageCodes.REQUIRED_FIELD]: "This field is required.",
  [MessageCodes.INVALID_EMAIL]: "Please enter a valid email address.",
  [MessageCodes.INVALID_PASSWORD]: "Password format is invalid.",
  [MessageCodes.EXISTING_USER]: "Username or email already in use.",
  [MessageCodes.AUTH_FAILED]: "Authentication failed. Check your credentials.",
  [MessageCodes.SERVER_ERROR]: "An unexpected server error occurred.",
  [MessageCodes.NOT_FOUND]: "The requested resource was not found.",
};
