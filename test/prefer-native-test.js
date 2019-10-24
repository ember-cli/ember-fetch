'use strict';

const AddonFactory = require('../');
const expect = require('chai').expect;
const helpers = require('broccoli-test-helper');
const vm = require('vm');
const fs = require('fs');
const RSVP = require('rsvp');
const co = require('co');

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

    afterEach(co.wrap(function* () {
      yield output.dispose();
    }));

    it('preferNative is built into vendor file', co.wrap(function*() {
      yield output.build();
      let files = output.read();
      expect(files).to.have.all.keys('ember-fetch.js');
      expect(files['ember-fetch.js']).to.include(`var preferNative = ${preferNative}`);
    }));

    it(`${
      preferNative ? 'Prefers' : "Doesn't prefer"
    } native fetch as specified`, co.wrap(function*() {
      yield output.build();
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
    }));

    if (preferNative === true) {
      it('Has fetch poly fill even if fetch is not there', co.wrap(function*() {
        yield output.build();
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
      }))
    }
  });
});
