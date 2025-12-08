import { getLogger } from "../../utils/logger.ts";
import { bootstrapASTChecker, checkCustomRules } from "./ast-checker.ts";
import { bootstrapTypeChecker, typeCheckCode } from "./type-checker.ts";
import type { ValidationContext, ValidationError, ValidationResult } from "./types.ts";
const logger = getLogger("api/agent/validation/validator.ts", "debug");

export const bootstrapValidator = (): void => {
  bootstrapTypeChecker();
  bootstrapASTChecker();
  logger.debug("Validator bootstrapped");
};

export const validateCode = async (
  code: string,
  context?: ValidationContext
): Promise<ValidationResult> => {
  logger.debug("Starting validation");
  const errors: ValidationError[] = [];

  const customRulesResult = checkCustomRules(code, context);
  if (!customRulesResult.valid) {
    errors.push(...customRulesResult.errors);
    return { valid: false, errors };
  }
  logger.debug("Custom rules checked");

  const typeCheckResult = typeCheckCode(code);
  if (!typeCheckResult.valid) {
    errors.push(...typeCheckResult.errors);
  }
  logger.debug("Type checked");

  return {
    valid: errors.length === 0,
    errors,
  };
};
