'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      ],
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  globals: {
    require: true,
    beforeEach: true,
    it: true,
    describe: true,
    afterEach: true,
    process: true,
    module: true,
  },
  rules: {
    'ember/no-new-mixins': 'off',
    'ember/no-jquery': 'error',
    'no-console': ['error', { allow: ['warn'] }],
    'ember/no-classic-classes': 'off',
    'ember/no-actions-hash': 'off',
  },
  overrides: [
    // TypeScript files
    {
      files: ['addon/**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        'no-undef': 'off',
        'no-unused-var': 'off',
      },
    },
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.stylelintrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
      rules: {
        'node/no-unpublished-require': 'off',
        'node/no-extraneous-require': 'off',
      },
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
  ],
};
