module.exports = {
  env: {
    'node': true,
    'jest/globals': true,
  },
  plugins: ['@typescript-eslint', 'jest', 'import', 'unused-imports', 'eslint-plugin-tsdoc'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    // Opt-in
    'tsdoc/syntax': 'warn',
    'unused-imports/no-unused-imports-ts': 'error',
    'object-shorthand': 'error',

    // Opt-out
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // Configure
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['/test/**/*', '**/*.test.js', '**/*.spec.js'],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],

    'import/order': [
      'error',
      {
        'groups': ['builtin', ['external', 'internal'], ['parent', 'sibling'], ['index']],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // line spacing
    'padding-line-between-statements': [
      'error',
      // wildcard inclusions
      {
        blankLine: 'always',
        prev: ['multiline-block-like', 'multiline-const', 'multiline-expression'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['multiline-block-like', 'multiline-const', 'multiline-expression', 'switch', 'return'],
      },
      // specific exclusions for case statements
      { blankLine: 'never', prev: 'case', next: 'multiline-block-like' },
      { blankLine: 'never', prev: 'multiline-block-like', next: 'case' },
    ],

    // ignore unused vars prefixed with '_'
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  ignorePatterns: ['build', 'node_modules'],
  overrides: [
    {
      files: ['*.test.*'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['off'],
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
