/* eslint-env node */
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactCompiler = require('eslint-plugin-react-compiler');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  reactCompiler.configs.recommended,
  { ignores: ['**/node_modules', '**/dist', '**/out', '**/drizzle'] },
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'off',

      // 1. Comillas simples obligatorias
      quotes: ['error', 'single', { avoidEscape: true }],

      // 2. Línea en blanco al final del archivo
      'eol-last': ['error', 'always'],

      // 3. Coma final obligatoria
      'comma-dangle': ['error', 'always-multiline'],

      // 4. Punto y coma obligatorio
      semi: ['error', 'always'],
    },
  },
  eslintPluginPrettierRecommended,
]);
