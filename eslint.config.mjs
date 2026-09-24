import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Código gerado pelo Prisma
    "generated/**",
    "prisma/generated/**",

    // Dependências e arquivos de distribuição
    "node_modules/**",
    "dist/**",

    // Arquivos temporários e de cobertura
    "coverage/**",
  ]),
]);

export default eslintConfig;
