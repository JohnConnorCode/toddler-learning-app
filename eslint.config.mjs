import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ignore scripts (CommonJS)
    "scripts/**",
    // Ignore test files
    "src/test/**",
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "vitest.config.ts",
  ]),
  // Custom rules to relax strictness
  {
    rules: {
      // Allow unescaped entities (common in React)
      "react/no-unescaped-entities": "off",
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
    }
  }
]);

export default eslintConfig;
