'use strict';

const AddonFactory = require('../');
const expect = require('chai').expect;
const helpers = require('broccoli-test-helper');
const vm = require('vm');
const fs = require('fs');
const RSVP = require('rsvp');

const testCode = `
define('fetch-test', ['fetch'], function(_fetch) {
  _fetch.default();
});
require('fetch-test');
`;

[true, false].forEach(preferNative => {
  describe(`Build browser assets with preferNative = ${preferNative}`, function() {
    let output, subject, addon;

    beforeEach(function() {
      addon = Object.create(AddonFactory);
      Object.assign(addon, {
        addons: [],
        _fetchBuildConfig: {
          preferNative
        },
        ui: {
          writeWarnLine() {},
        },
      });
      subject = addon.treeForVendor();
      output = helpers.createBuilder(subject);
    });

    afterEach(async function () {
      await output.dispose();
    });

    it('preferNative is built into vendor file', async function () {
      await output.build();
      let files = output.read();
      expect(files).to.have.all.keys('ember-fetch.js');
      expect(files['ember-fetch.js']).to.include(`var preferNative = ${preferNative}`);
    });

    it(`${
      preferNative ? 'Prefers' : "Doesn't prefer"
    } native fetch as specified`, async function () {
      await output.build();
      let emberFetchCode = output.read()['ember-fetch.js'];
      const amdLoaderCode = fs.readFileSync(require.resolve('loader.js'));
      const sandbox = {
        __result: false,
        window: {
          fetch: function() {
            sandbox.__result = true;
          },
          Ember: { RSVP }
        }
      };
      vm.createContext(sandbox);
      const code = amdLoaderCode + emberFetchCode + testCode;
      vm.runInContext(code, sandbox);
      expect(sandbox.__result).to.equal(preferNative);
    });

    if (preferNative === true) {
      it('Has fetch poly fill even if fetch is not there', async function () {
        await output.build();
        let emberFetchCode = output.read()['ember-fetch.js'];
        const amdLoaderCode = fs.readFileSync(require.resolve('loader.js'));
        const sandbox = {
          console,
          window: {
            __result: false,
            // no fetch here
            // fetch: function() {},
            Ember: { RSVP }
          }
        };
        vm.createContext(sandbox);
        const testCodeForNonFetch = `
          define('fetch-test', ['fetch'], function(_fetch) {
            if (_fetch.default.polyfill) {
              window.__result = true
            }
          });
          require('fetch-test');
        `;
        const code = amdLoaderCode + emberFetchCode + testCodeForNonFetch;
        vm.runInContext(code, sandbox);
        expect(sandbox.window.__result).to.equal(true);
      })
    }
  });

  describe(`Build browser assets with preferNative = ${preferNative} in nested dependencies`, function() {
    let output, subject, addon;

    beforeEach(function() {
      addon = Object.create(AddonFactory);

      let app = {
        _fetchBuildConfig: {
          preferNative
        }
      };

      Object.assign(addon, {
        addons: [],
        _findHost() {
          return app;
        },
        ui: {
          writeWarnLine() {},
        },
      });
      subject = addon.treeForVendor();
      output = helpers.createBuilder(subject);
    });

    afterEach(async function () {
      await output.dispose();
    });

    it('preferNative is built into vendor file', async function () {
      await output.build();
      let files = output.read();
      expect(files).to.have.all.keys('ember-fetch.js');
      expect(files['ember-fetch.js']).to.include(`var preferNative = ${preferNative}`);
    });

    it(`${
      preferNative ? 'Prefers' : "Doesn't prefer"
      } native fetch as specified`, async function () {
      await output.build();
      let emberFetchCode = output.read()['ember-fetch.js'];
      const amdLoaderCode = fs.readFileSync(require.resolve('loader.js'));
      const sandbox = {
        __result: false,
        window: {
          fetch: function() {
            sandbox.__result = true;
          },
          Ember: { RSVP }
        }
      };
      vm.createContext(sandbox);
      const code = amdLoaderCode + emberFetchCode + testCode;
      vm.runInContext(code, sandbox);
      expect(sandbox.__result).to.equal(preferNative);
    });

    if (preferNative === true) {
      it('Has fetch poly fill even if fetch is not there', async function () {
        await output.build();
        let emberFetchCode = output.read()['ember-fetch.js'];
        const amdLoaderCode = fs.readFileSync(require.resolve('loader.js'));
        const sandbox = {
          console,
          window: {
            __result: false,
            // no fetch here
            // fetch: function() {},
            Ember: { RSVP }
          }
        };
        vm.createContext(sandbox);
        const testCodeForNonFetch = `
          define('fetch-test', ['fetch'], function(_fetch) {
            if (_fetch.default.polyfill) {
              window.__result = true
            }
          });
          require('fetch-test');
        `;
        const code = amdLoaderCode + emberFetchCode + testCodeForNonFetch;
        vm.runInContext(code, sandbox);
        expect(sandbox.window.__result).to.equal(true);
      })
    }
  });

  describe(`Build browser assets with preferNative = ${preferNative} in nested dependencies without _findHost`, function() {
    let output, subject, addon;

    beforeEach(function() {
      addon = Object.create(AddonFactory);

      let app = {
        _fetchBuildConfig: {
          preferNative
        }
      };

      Object.assign(addon, {
        addons: [],
        app: this,
        parent: {
          parent: {
            app,
            parent: {}
          }
        },
        ui: {
          writeWarnLine() {},
        },
      });
      subject = addon.treeForVendor();
      output = helpers.createBuilder(subject);
    });

    afterEach(async function () {
      await output.dispose();
    });

    it('preferNative is built into vendor file', async function () {
      await output.build();
      let files = output.read();
      expect(files).to.have.all.keys('ember-fetch.js');
      expect(files['ember-fetch.js']).to.include(`var preferNative = ${preferNative}`);
    });

    it(`${
      preferNative ? 'Prefers' : "Doesn't prefer"
      } native fetch as specified`, async function () {
      await output.build();
      let emberFetchCode = output.read()['ember-fetch.js'];
      const amdLoaderCode = fs.readFileSync(require.resolve('loader.js'));
      const sandbox = {
        __result: false,
        window: {
          fetch: function() {
            sandbox.__result = true;
          },
          Ember: { RSVP }
        }
      };
      vm.createContext(sandbox);
      const code = amdLoaderCode + emberFetchCode + testCode;
      vm.runInContext(code, sandbox);
      expect(sandbox.__result).to.equal(preferNative);
    });

    if (preferNative === true) {
      it('Has fetch poly fill even if fetch is not there', async function () {
        await output.build();
        let emberFetchCode = output.read()['ember-fetch.js'];
        const amdLoaderCode = fs.readFileSync(require.resolve('loader.js'));
        const sandbox = {
          console,
          window: {
            __result: false,
            // no fetch here
            // fetch: function() {},
            Ember: { RSVP }
          }
        };
        vm.createContext(sandbox);
        const testCodeForNonFetch = `
          define('fetch-test', ['fetch'], function(_fetch) {
            if (_fetch.default.polyfill) {
              window.__result = true
            }
          });
          require('fetch-test');
        `;
        const code = amdLoaderCode + emberFetchCode + testCodeForNonFetch;
        vm.runInContext(code, sandbox);
        expect(sandbox.window.__result).to.equal(true);
      })
    }
  });
});
