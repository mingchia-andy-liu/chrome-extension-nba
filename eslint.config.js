const js = require('@eslint/js')
const globals = require('globals')
const importPlugin = require('eslint-plugin-import')
const nPlugin = require('eslint-plugin-n')
const promisePlugin = require('eslint-plugin-promise')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')

module.exports = [
  {
    ignores: ['build/**', 'coverage/**', 'dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['src/app/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.jest,
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      camelcase: 'off',
      eqeqeq: 'off',
      'n/no-callback-literal': 'warn',
      'no-empty': 'off',
      'no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
]
