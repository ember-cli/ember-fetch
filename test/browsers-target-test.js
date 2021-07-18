'use strict';

const AddonFactory = require('../');
const expect = require('chai').expect;
const helpers = require('broccoli-test-helper');

function makeAddonInstance({ browsers, ...config }) {
  const addon = Object.create(AddonFactory);
  Object.assign(addon, {
    addons: [],
    ui: {
      writeWarnLine() {},
      writeDeprecateLine() {},
    }
  });
  addon._fetchBuildConfig = addon._normalizeBuildConfig(
    { hasEmberSourceModules: true, browsers },
    config
  );
  return addon;
}

describe(`Do not include the polyfill if the browser targets match`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = makeAddonInstance({
      preferNative: true,
      alwaysIncludePolyfill: false,
      browsers: ['last 1 chrome versions']
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
    addon = makeAddonInstance({
      preferNative: false,
      alwaysIncludePolyfill: false,
      browsers: ['last 1 chrome versions']
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
    addon = makeAddonInstance({
      preferNative: true,
      alwaysIncludePolyfill: false,
      browsers: ['ie 11']
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

describe(`Do not include the polyfill if the browser targets do not match, but includePolyfill='never'`, function () {
  let output, subject, addon;

  beforeEach(function() {
    addon = makeAddonInstance({
      includePolyfill: 'never',
      browsers: ['ie 11']
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

describe(`Include the abortcontroller polyfill only if the browser targets support fetch only`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = makeAddonInstance({
      preferNative: true,
      alwaysIncludePolyfill: false,
      browsers: ['safari 11']
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

describe(`Include the polyfill if includePolyfill='always'`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = makeAddonInstance({
      includePolyfill: 'always',
      browsers: ['last 1 chrome versions']
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

describe(`[deprecated] Include the polyfill if alwaysIncludePolyfill=true`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = makeAddonInstance({
      preferNative: true,
      alwaysIncludePolyfill: true,
      browsers: ['last 1 chrome versions']
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

