'use strict';

const caniuse = require('caniuse-api');
const path = require('path');
// We use a few different Broccoli plugins to build our trees:
//
// broccoli-templater: renders the contents of a file inside a template.
// Used to wrap the browser polyfill in a shim that prevents it from exporting
// a global.
//
// broccoli-merge-trees: merge several broccoli trees (folders) to a single tree
//
// broccoli-concat: concatenate input files to single output file
//
// broccoli-stew: super useful library of Broccoli utilities. We use:
//
//   * find - finds files in a tree based on a glob pattern
//   * map - map content of files in a tree
//
// broccoli-rollup: rollup dependencies to expected module format
//
const stew = require('broccoli-stew');
const Template = require('broccoli-templater');
const MergeTrees = require('broccoli-merge-trees');
const concat = require('broccoli-concat');
const map = stew.map;
const Rollup = require('broccoli-rollup');
const BroccoliDebug = require('broccoli-debug');
const calculateCacheKeyForTree = require('calculate-cache-key-for-tree');
const VersionChecker = require('ember-cli-version-checker');

const debug = BroccoliDebug.buildDebugCallback('ember-fetch');

// Path to the template that contains the shim wrapper around the browser polyfill
const TEMPLATE_PATH = path.resolve(__dirname + '/assets/browser-fetch.js.t');

/*
 * The `index.js` file is the main entry point for all Ember CLI addons.  The
 * object we export from this file is turned into an Addon class
 * (https://github.com/ember-cli/ember-cli/blob/master/lib/models/addon.js) by
 * Ember CLI.
 *
 * This addon is relatively simple: it includes both `node-fetch` and
 * `whatwg-fetch` as npm dependencies, and swaps the correct version in
 * depending on whether the Ember app is being built for FastBoot or the
 * browser.
 *
 * At a high-level, the flow for this addon is:
 *
 * 1. When a build starts and the addon is included, tell Ember CLI to import
 *    `vendor/fetch.js` into the vendor.js file. `vendor/fetch.js` doesn't
 *    actually exist yet; we'll create it later.
 * 2. When Ember CLI asks for the addon's vendor tree, we'll return a Broccoli
 *    tree that contains the correct fetch() version.
 * 3. In the case of the browser polyfill, we wrap it in a shim that that makes
 *    it compatible with Ember's module system. (Normally the polyfill exports a
 *    global, but we can rely on the fact that Ember users are using modules.)
 */
module.exports = {
  name: 'ember-fetch',

  /*
   * The `included` hook is invoked at the very beginning of the build process.
   * It gets passed the `EmberApp` model
   * (https://github.com/ember-cli/ember-cli/blob/master/lib/broccoli/ember-app.js),
   * which allows us to use the `import()` method to tell it to include a file
   * from our `vendor` tree into the final built app.
   */
  included: function() {
    this._super.included.apply(this, arguments);

    let isApp = !this.project.isEmberCLIAddon();

    let hasEmberFetch = !!this.project.findAddonByName('ember-fetch');
    let hasEmberCliFastboot = !!this.project.findAddonByName('ember-cli-fastboot');

    let emberSource = new VersionChecker(this.project).for('ember-source');
    let hasEmberSourceModules = emberSource.exists() && emberSource.gte('3.27.0');

    if(isApp && hasEmberCliFastboot && !hasEmberFetch) {
      throw new Error(`Ember fetch is not installed as top-level dependency of the application using fastboot. Add ember-fetch as dependecy in application's package.json.
      For details check here - https://github.com/ember-cli/ember-fetch#top-level-addon`);
    }

    let app = this._findApp();
    let importTarget = app;

    if (typeof this.import === 'function') {
      importTarget = this;
    }

    app._fetchBuildConfig = Object.assign({
      preferNative: false,
      nativePromise: false,
      alwaysIncludePolyfill: false,
      hasEmberSourceModules,
      browsers: this.project.targets && this.project.targets.browsers
    }, app.options['ember-fetch']);

    importTarget.import('vendor/ember-fetch.js', {
      exports: {
        default: [
          'default',
          'Headers',
          'Request',
          'Response',
          'AbortController'
        ]
      }
    });
  },

  /*
   * Returns a Broccoli tree for the addon's `vendor` directory. The `vendor`
   * directory is kind of a junk drawer; nothing we put in it is used unless we
   * explicitly `import()` a file (which we do in the `included` hook, above).
   *
   * To build our tree, we first pass in option flags and detect whether we're
   * in a FastBoot build or not. Based on that, we return a tree that contains
   * the correct version of the polyfill at the `vendor/ember-fetch.js` path.
   */
  treeForVendor() {
    let babelAddon = this.addons.find(addon => addon.name === 'ember-cli-babel');

    const app = this._findApp();
    const options = app._fetchBuildConfig;

    let browserTree = this.treeForBrowserFetch(options);
    if (babelAddon) {
      browserTree = debug(babelAddon.transpileTree(browserTree, {
        'ember-cli-babel': {
          compileModules: false,
        },
      }), 'after-babel');

    } else {
      this.ui.writeWarnLine('[ember-fetch] Could not find `ember-cli-babel` addon, opting out of transpilation!')
    }

    const preferNative = options.preferNative;

    return debug(map(browserTree, (content) => `if (typeof FastBoot === 'undefined') {
      var preferNative = ${preferNative};
      ${content}
    }`), 'wrapped');
  },

  // Only include public/fetch-fastboot.js if top level addon
  treeForPublic() {
    const fastbootEnabled = process.env.FASTBOOT_DISABLED !== 'true'
      && !!this.project.findAddonByName('ember-cli-fastboot');
    return !this.parent.parent && fastbootEnabled
      ? this._super.treeForPublic.apply(this, arguments) : null;
  },

  cacheKeyForTree(treeType) {
    if (treeType === 'public') {
      return calculateCacheKeyForTree('public', this, [!this.parent.parent]);
    } else {
      // make sure results of other treeFor* methods won't get opt-out of cache
      // including the "treeForVendor"
      return calculateCacheKeyForTree(treeType, this);
    }
  },

  // Add node version of fetch.js into fastboot package.json manifest vendorFiles array
  updateFastBootManifest(manifest) {
    manifest.vendorFiles.push('ember-fetch/fetch-fastboot.js');
    return manifest;
  },

  // Returns a tree containing the browser polyfill (from `whatwg-fetch` and `abortcontroller-polyfill`),
  // wrapped in a shim that stops it from exporting a global and instead turns it into a module
  // that can be used by the Ember app.
  treeForBrowserFetch(options) {
    const browsers = options.browsers;
    // To skip including the polyfill, `preferNative` needs to be `true` AND `alwaysIncludePolyfill` needs to be `false` (default)
    const alwaysIncludePolyfill = !options.preferNative || options.alwaysIncludePolyfill;
    const needsFetchPolyfill = alwaysIncludePolyfill || !this._checkSupports('fetch', browsers);
    const needsAbortControllerPolyfill = alwaysIncludePolyfill || !this._checkSupports('abortcontroller', browsers);

    const inputNodes = [];
    const inputFiles = [];

    if (needsAbortControllerPolyfill) {
      const abortcontrollerNode = debug(new Rollup(path.dirname(path.dirname(require.resolve('abortcontroller-polyfill'))), {
        rollup: {
          input: 'src/abortcontroller-polyfill.js',
          output: {
            file: 'abortcontroller.js',
            // abortcontroller is polyfill only, the name is only required by rollup iife
            name: 'AbortController',
            format: 'iife'
          }
        }
      }), 'abortcontroller');

      inputNodes.push(abortcontrollerNode);
      inputFiles.push('abortcontroller.js');
    }

    if (needsFetchPolyfill) {
      const fetchNode = debug(new Rollup(path.dirname(path.dirname(require.resolve('whatwg-fetch'))), {
        rollup: {
          input: 'fetch.js',
          output: {
            file: 'fetch.js',
            name: 'WHATWGFetch',
            format: 'iife'
          }
        }
      }), 'whatwg-fetch');

      inputNodes.push(fetchNode);
      inputFiles.push('fetch.js');
    }

    const polyfillNode = debug(concat(new MergeTrees(inputNodes), {
      inputFiles,
      allowNone: true,
      outputFile: 'ember-fetch.js',
      sourceMapConfig: { enabled: false }
    }), 'after-concat');

    const moduleHeader = this._getModuleHeader(options);

    return debug(
      new Template(polyfillNode, TEMPLATE_PATH, function (content) {
        return {
          moduleHeader,
          moduleBody: content,
        };
      }),
      "browser-fetch"
    );
  },

  _getModuleHeader({ hasEmberSourceModules, nativePromise }) {
    if (hasEmberSourceModules && nativePromise) {
      return `
define('fetch', ['exports', 'ember'], function(exports, Ember__module) {
  'use strict';
  var Ember = 'default' in Ember__module ? Ember__module['default'] : Ember__module;`;
    }

    if (hasEmberSourceModules) {
      return `
define('fetch', ['exports', 'ember', 'rsvp'], function(exports, Ember__module, RSVP__module) {
  'use strict';
  var Ember = 'default' in Ember__module ? Ember__module['default'] : Ember__module;
  var RSVP = 'default' in RSVP__module ? RSVP__module['default'] : RSVP__module;
  var Promise = RSVP.Promise;`;
    }

    if (nativePromise) {
      return `
define('fetch', ['exports'], function(exports) {
  'use strict';
  var Ember = originalGlobal.Ember;`;
    }

    return `
define('fetch', ['exports'], function(exports) {
  'use strict';
  var Ember = originalGlobal.Ember;
  var Promise = Ember.RSVP.Promise;`;
  },

  _checkSupports(featureName, browsers) {
    if (!browsers) {
      return false;
    }

    let browserList = browsers.join(', ');
    return caniuse.isSupported(featureName, browserList);
  },

  _findApp() {
    if (typeof this._findHost === 'function') {
      return this._findHost();
    } else {
      // Otherwise, we'll use this implementation borrowed from the _findHost()
      // method in ember-cli.
      // Keep iterating upward until we don't have a grandparent.
      // Has to do this grandparent check because at some point we hit the project.
      let app;
      let current = this;
      do {
         app = current.app || this;
      } while (current.parent && current.parent.parent && (current = current.parent));

      return app;
    }
  },
};
