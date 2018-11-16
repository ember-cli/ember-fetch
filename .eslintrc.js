module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: ['ember'],
  extends: ['eslint:recommended', 'plugin:ember/recommended'],
  env: {
    browser: true
  },
  rules: {
    'no-console': ["error", { allow: ['warn'] }]
  },
  overrides: [
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
      excludedFiles: [
        'app/**',
        'addon-test-support/**',
        'addon/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
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
      files: [
        'test/**/*.js',
      ],
      env: {
        mocha: true,
      },
      rules: {
        'node/no-unpublished-require': 'off',
        'node/no-extraneous-require': 'off'
      }
    }
  ]
};
