'use strict';

var path = require('path');
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
var stew = require('broccoli-stew');
var Template = require('broccoli-templater');
var MergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var map = stew.map;
var find = stew.find;

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
  included: function(app) {
    this._super.included.apply(this, arguments);

    let target = app;

    if (typeof this.import === 'function') {
      target = this;
    } else {
      // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just
      // use that.
      if (typeof this._findHost === 'function') {
        target = this._findHost();
      } else {
        // Otherwise, we'll use this implementation borrowed from the _findHost()
        // method in ember-cli.
        // Keep iterating upward until we don't have a grandparent.
        // Has to do this grandparent check because at some point we hit the project.
        let current = this;
        do {
          target = current.app || app;
        } while (current.parent.parent && (current = current.parent));
      }
      // If this.import is not a function, app and target should point to the same EmberApp
      app = target;
    }

    this.buildConfig = app.options['ember-fetch'] || { preferNative: false };

    target.import('vendor/ember-fetch.js', {
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
  treeForVendor: function() {
    var browserTree = treeForBrowserFetch();
    var preferNative = this.buildConfig.preferNative;
    browserTree = map(browserTree, (content) => `if (typeof FastBoot === 'undefined') {
      var preferNative = ${preferNative};
      ${content}
    }`);
    return browserTree;
  },

  //add node version of fetch.js into fastboot package.json manifest vendorFiles array
  updateFastBootManifest: function (manifest) {
    manifest.vendorFiles.push('ember-fetch/fastboot-fetch.js');
    return manifest;
  }
};

// Path to the template that contains the shim wrapper around the browser
// polyfill
var templatePath = path.resolve(__dirname + '/assets/browser-fetch.js.t');


// Returns a tree containing the browser polyfill (from `whatwg-fetch` and `abortcontroller-polyfill`),
// wrapped in a shim that stops it from exporting a global and instead turns it into a module
// that can be used by the Ember app.
function treeForBrowserFetch() {
  var fetchTree = path.dirname(require.resolve('whatwg-fetch'));
  var abortcontrollerTree = path.dirname(require.resolve('abortcontroller-polyfill'));
  var polyfillTree = concat(new MergeTrees([abortcontrollerTree, fetchTree]), {
    inputFiles: ['abortcontroller-polyfill-only.js', 'fetch.umd.js'],
    outputFile: 'ember-fetch.js'
  });

  return new Template(polyfillTree, templatePath, function(content) {
    return {
      moduleBody: content
    };
  });
}
