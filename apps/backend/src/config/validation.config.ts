import {
  NormalizeOptions,
  PasswordValidationConfig,
  UsernameValidationConfig,
} from "@shared/types";

const emailOptions: NormalizeOptions = {
  stripPlusAliases: true,
};

const passwordRules: PasswordValidationConfig = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
};

const usernameRules: UsernameValidationConfig = {
  minLength: 3,
  maxLength: 30,
  allowDot: true,
  allowUnderscore: true,
  allowHyphen: false,
  noLeadingTrailingSymbols: true,
  noConsecutiveSymbols: true,
};

export const validationConfig = {
  emailOptions,
  passwordRules,
  usernameRules,
};
