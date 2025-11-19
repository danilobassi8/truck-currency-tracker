const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = [
  {
    ignores: ['**/dist'],
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    files: ['**/*.ts', '**/*.js'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.js', '**/*.cjs', '**/*.mjs', '**/*.html'],
    rules: {},
  },
  eslintPluginPrettierRecommended,
];
