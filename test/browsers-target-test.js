'use strict';

const AddonFactory = require('../');
const expect = require('chai').expect;
const helpers = require('broccoli-test-helper');

describe(`Do not include the polyfill if the browser targets match`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: true,
        alwaysIncludePolyfill: false,
        browsers: ['last 1 chrome versions']
      },
      ui: {
        writeWarnLine() {
        }
      }
    });
    subject = addon.treeForVendor();
    output = helpers.createBuilder(subject);
  });

  afterEach(async function () {
    await output.dispose();
  });

  it('fetch & AbortController polyfills are not included', async function () {
    await output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = true`);
    expect(files['ember-fetch.js']).to.not.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.not.include(`class AbortController`);
  });

});

describe(`Ignore target browsers if preferNative is false`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: false,
        alwaysIncludePolyfill: false,
        browsers: ['last 1 chrome versions']
      },
      ui: {
        writeWarnLine() {
        }
      }
    });
    subject = addon.treeForVendor();
    output = helpers.createBuilder(subject);
  });

  afterEach(async function () {
    await output.dispose();
  });

  it('fetch & AbortController polyfills are included', async function () {
    await output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = false`);
    expect(files['ember-fetch.js']).to.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.include(`class AbortController`);
  });

});

describe(`Include the polyfill if the browser targets do not match`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: true,
        alwaysIncludePolyfill: false,
        browsers: ['ie 11']
      },
      ui: {
        writeWarnLine() {
        }
      }
    });
    subject = addon.treeForVendor();
    output = helpers.createBuilder(subject);
  });

  afterEach(async function () {
    await output.dispose();
  });

  it('fetch & AbortController polyfills are included', async function () {
    await output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = true`);
    expect(files['ember-fetch.js']).to.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.include(`class AbortController`);
  });

});

describe(`Include the abortcontroller polyfill only if the browser targets support fetch only`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: true,
        alwaysIncludePolyfill: false,
        browsers: ['safari 11']
      },
      ui: {
        writeWarnLine() {
        }
      }
    });
    subject = addon.treeForVendor();
    output = helpers.createBuilder(subject);
  });

  afterEach(async function () {
    await output.dispose();
  });

  it('AbortController polyfill is included', async function () {
    await output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = true`);
    expect(files['ember-fetch.js']).to.not.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.include(`class AbortController`);
  });

});

describe(`Include the polyfill if alwaysIncludePolyfill=true`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: true,
        alwaysIncludePolyfill: true,
        browsers: ['last 1 chrome versions']
      },
      ui: {
        writeWarnLine() {
        }
      }
    });
    subject = addon.treeForVendor();
    output = helpers.createBuilder(subject);
  });

  afterEach(async function () {
    await output.dispose();
  });

  it('fetch & AbortController polyfills are included', async function () {
    await output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = true`);
    expect(files['ember-fetch.js']).to.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.include(`class AbortController`);
  });

});
