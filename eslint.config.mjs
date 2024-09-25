import jsPlugin from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals'; // Add globals to configure browser or Node.js globals

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // If this is a browser environment
        ...globals.node, // If this is a Node.js environment (adjust according to your setup)
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      prettier: prettierPlugin, // Add the prettier plugin
    },
    settings: {
      react: {
        version: 'detect', // Automatically detects the React version
      },
    },
    rules: {
      ...jsPlugin.configs.recommended.rules,
      ...tsPlugin.configs['recommended'].rules,
      ...reactPlugin.configs['recommended'].rules,
      ...prettierConfig.rules, // Import Prettier's ESLint rules
      'prettier/prettier': 'error', // Treat Prettier formatting issues as ESLint errors
      '@typescript-eslint/no-require-imports': 'off', // Turn off the rule
      'no-console': ['error', { allow: ['warn', 'error'] }], // Disallow `console.log`, allow `console.warn` and `console.error`
    },
  },
];
