'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: ['eslint:recommended', 'plugin:ember/recommended'],
  env: {
    browser: true
  },
  globals: {
    fetch: 'off',
    Headers: 'off',
    Request: 'off',
    Response: 'off',
    AbortController: 'off'
  },
  rules: {
    'ember/no-new-mixins': 'off',
    'ember/no-jquery': 'error',
    'no-console': ['error', { allow: ['warn'] }]
  },
  overrides: [
    // TypeScript files
    {
      files: ['addon/**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        'no-undef': 'off',
        'no-unused-var': 'off'
      }
    },
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      excludedFiles: ['app/**', 'addon-test-support/**', 'addon/**', 'tests/dummy/app/**'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    {
      // Test files:
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
    // node tests
    {
      files: ['test/**/*.js'],
      env: {
        mocha: true,
        node: true
      },
      rules: {
        'node/no-unpublished-require': 'off',
        'node/no-extraneous-require': 'off'
      }
    }
  ],
};
