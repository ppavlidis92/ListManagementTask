import jsPlugin from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react": reactPlugin,
      "prettier": prettierPlugin, // Add the prettier plugin
    },
    rules: {
      ...jsPlugin.configs.recommended.rules,
      ...tsPlugin.configs["recommended"].rules,
      ...reactPlugin.configs["recommended"].rules,
      ...prettierConfig.rules, // Import Prettier's ESLint rules
      "prettier/prettier": "error", // Treat Prettier formatting issues as ESLint errors
    },
  },
];
