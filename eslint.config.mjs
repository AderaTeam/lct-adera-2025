import eslintPluginImportPaths from '@adera/eslint-plugin-import-paths';
import eslintJs from '@eslint/js';
import eslintPluginStylex from '@stylexjs/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import typescriptEslint from 'typescript-eslint';

const frontImportTypes = ['components', 'features', 'hooks', 'routes', 'store', 'styles', 'utils'];
const frontFiles = ['packages/frontend/**/*.{ts,tsx}'];

const backFiles = ['packages/backend/**/*.{js,cjs,mjs,ts}'];
const backTSFiles = ['packages/backend/**/*.ts'];

export default [
  {
    // global ignores
    ignores: [
      '**/.*/*',
      '**/dist*/*'
      // TODO: разобраться с ошибками (и за одно обновить @stylexjs/stylex и @stylexjs/eslint-plugin, чтобы их стало еще больше)
    ]
  },

  // FRONT: typescript-eslint
  { ...eslintJs.configs.recommended, files: frontFiles },
  ...typescriptEslint.configs.strictTypeChecked.map((config) => ({ ...config, files: frontFiles })),
  ...typescriptEslint.configs.stylisticTypeChecked.map((config) => ({ ...config, files: frontFiles })),
  { files: frontFiles, languageOptions: { parserOptions: { ecmaVersion: 'latest', projectService: true } } },

  // FRONT: eslint-plugin-react
  { ...eslintPluginReact.configs.flat.recommended, files: frontFiles },
  { ...eslintPluginReact.configs.flat['jsx-runtime'], files: frontFiles },
  // если не указать версию, то eslint-plugin-react показывает warning
  { files: frontFiles, settings: { react: { version: 'detect' } } },

  {
    // FRONT: custom rules
    files: frontFiles,
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh,
      '@stylexjs': eslintPluginStylex,
      import: eslintPluginImport
    },
    rules: {
      'no-irregular-whitespace': [1, { skipJSXText: true }],
      // try { ... } catch (err) { // do nothing }
      '@typescript-eslint/no-unused-vars': [2, { caughtErrors: 'none' }],
      // !roleChanged && timeoutId && clearTimeout(timeoutId)
      '@typescript-eslint/no-unused-expressions': [2, { allowShortCircuit: true }],
      // function useAuthFetch<D>(endpoint: string, options?: { method?: string; body?: string; skip?: boolean }) {
      '@typescript-eslint/no-unnecessary-type-parameters': 0,
      // мешает при передаче promise-функций в качестве html-хендлеров и колбэков
      '@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: { attributes: false, arguments: false } }],
      ...eslintPluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [1, { allowConstantExport: true }],
      '@stylexjs/valid-styles': 1,
      '@stylexjs/sort-keys': [1, { allowLineSeparatedGroups: true }],
      'import/order': [
        1,
        {
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
          pathGroupsExcludedImportTypes: frontImportTypes,
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            // внутренние библиотеки после внешних
            { pattern: '@adera/**', group: 'external', position: 'after' },
            // импорт SCSS-модулей всегда в самом низу
            { pattern: './*.module.scss', group: 'sibling', position: 'after' },
            // отделяет внутренние импорты от внешних
            ...frontImportTypes.map((frontImportType) => ({
              pattern: `${frontImportType}/**/*`,
              group: 'internal'
            }))
          ]
        }
      ]
    }
  },
  {
    // FRONT: @adera/eslint-plugin-import-paths
    files: frontFiles,
    ignores: ['packages/frontend/lib/*'],
    plugins: { 'import-paths': eslintPluginImportPaths },
    rules: { 'import-paths/import-paths': ['warn', { rootPaths: frontImportTypes }] }
  },

  {
    // BACK: custom rules
    files: backFiles,
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
      import: eslintPluginImport,
      'unused-imports': eslintPluginUnusedImports
    },
    rules: {
      // sorts and group imports and exports
      'simple-import-sort/imports': 1,
      'simple-import-sort/exports': 1,
      // rules for imports
      'import/first': 1,
      'import/newline-after-import': 1,
      'import/no-duplicates': 1,
      'unused-imports/no-unused-imports': 1
    }
  },

  // BACK: typescript-eslint
  { ...eslintJs.configs.recommended, files: backTSFiles },
  ...typescriptEslint.configs.recommended.map((config) => ({ ...config, files: backTSFiles })),
  { files: backTSFiles, languageOptions: { parserOptions: { ecmaVersion: 2020, projectService: true } } },

  {
    // BACK (TS): custom rules
    files: backTSFiles,
    rules: {
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/no-mixed-operators': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-inferrable-types': 0,
      '@typescript-eslint/interface-name-prefix': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/ban-ts-comment': [1, { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/no-empty-interface': 0
    }
  },

  // global prettier
  eslintConfigPrettier
];
