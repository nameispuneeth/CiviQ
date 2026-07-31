import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', caughtErrors: 'none' },
      ],
      // HMR ergonomics, not correctness — a context + provider in one file is fine.
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    // Config files run in Node, not the browser.
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // tailwind.config.js is the only CommonJS config here.
    files: ['tailwind.config.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
])
