module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
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
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'test/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: ['app/**', 'addon-test-support/**', 'addon/**', 'tests/dummy/app/**'],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
      })
    },
    // node tests
    {
      files: ['test/**/*.js'],
      env: {
        mocha: true
      },
      rules: {
        'node/no-unpublished-require': 'off',
        'node/no-extraneous-require': 'off'
      }
    }
  ]
};
