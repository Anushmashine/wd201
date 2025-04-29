// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
    },
  },
  {
    files: ['**/__tests__/**'],
    ...jestPlugin.configs.recommended,
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.git/**',
      '**/.husky/**',
    ],
  },
  prettier,
];
