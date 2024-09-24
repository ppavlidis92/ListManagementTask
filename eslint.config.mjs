import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    // Specify the files to lint
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser, // Use browser globals like window, document, etc.
    },
    // Plugins to extend ESLint
    plugins: {
      "@typescript-eslint": pluginTs,
      "react": pluginReact,
    },
    // Extend recommended configurations
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginTs.configs["recommended"].rules,
      ...pluginReact.configs["recommended"].rules,
      "semi": ["error", "always"], // Example: enforce semicolons
      "quotes": ["error", "double"], // Example: enforce single quotes
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
    }
  }
];
