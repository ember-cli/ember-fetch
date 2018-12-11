'use strict';

const AddonFactory = require('../');
const expect = require('chai').expect;
const helpers = require('broccoli-test-helper');
const co = require('co');

describe(`Do not include the polyfill if the browser targets match`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: true,
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

  afterEach(co.wrap(function* () {
    yield output.dispose();
  }));

  it('preferNative is built into vendor file', co.wrap(function* () {
    yield output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = true`);
    expect(files['ember-fetch.js']).to.not.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.not.include(`class AbortController`);
  }));

});

describe(`Force preferNative to true if the polyfill is not included`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: false,
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

  afterEach(co.wrap(function* () {
    yield output.dispose();
  }));

  it('preferNative is built into vendor file', co.wrap(function* () {
    yield output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = true`);
    expect(files['ember-fetch.js']).to.not.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.not.include(`class AbortController`);
  }));

});

describe(`Include the polyfill if the browser targets do not match`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: false,
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

  afterEach(co.wrap(function* () {
    yield output.dispose();
  }));

  it('preferNative is built into vendor file', co.wrap(function* () {
    yield output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = false`);
    expect(files['ember-fetch.js']).to.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.include(`class AbortController`);
  }));

});

describe(`Include the abortcontroller polyfill only if the browser targets support fetch only`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: false,
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

  afterEach(co.wrap(function* () {
    yield output.dispose();
  }));

  it('preferNative is built into vendor file', co.wrap(function* () {
    yield output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = true`);
    expect(files['ember-fetch.js']).to.not.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.include(`class AbortController`);
  }));

});

describe(`Include the polyfill if alwaysIncludePolyfill=true`, function() {
  let output, subject, addon;

  beforeEach(function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      addons: [],
      _fetchBuildConfig: {
        preferNative: false,
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

  afterEach(co.wrap(function* () {
    yield output.dispose();
  }));

  it('preferNative is built into vendor file', co.wrap(function* () {
    yield output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js');
    expect(files['ember-fetch.js']).to.include(`var preferNative = false`);
    expect(files['ember-fetch.js']).to.include(`fetch.polyfill = true`);
    expect(files['ember-fetch.js']).to.include(`class AbortController`);
  }));

});
