import { randomUUID } from "node:crypto";
import { Project } from "ts-morph";
import { rules } from "./rules/index.ts";
import type { ValidationContext, ValidationError, ValidationResult } from "./types.ts";

const project = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: {
    strict: true,
    skipLibCheck: true,
  },
});

export const bootstrapASTChecker = (): void => {
  // just a placeholder to load this file
};

export const checkCustomRules = (code: string, context?: ValidationContext): ValidationResult => {
  const filename = `${randomUUID()}.ts`;
  const sourceFile = project.createSourceFile(filename, code);

  try {
    const errors: ValidationError[] = [];

    for (const rule of rules) {
      errors.push(...rule(sourceFile, context));
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } finally {
    sourceFile.delete();
  }
};
