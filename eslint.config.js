import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'node_modules/**',
      'build/**',
      'public/build/**',
      'coverage/**',
      'playwright-report/**',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: true,
        process: true,
        setTimeout: true,
        clearTimeout: true,
        document: true,
        window: true,
        Request: true,
        Response: true,
        Headers: true,
        URL: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
] 
