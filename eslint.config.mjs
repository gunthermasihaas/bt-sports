import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "generated/prisma/**",
    "node_modules/**",
    "coverage/**",
  ]),

  ...nextVitals,
  ...nextTypeScript,
]);
