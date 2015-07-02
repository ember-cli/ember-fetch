/* jshint node: true */
'use strict';
var p = require('path');
var templatePath = p.resolve(__dirname + '/assets/module-template.js.t');

var stew = require('broccoli-stew');
var rename = stew.rename;
var find = stew.find;
var Template = require('broccoli-templater');
var mergeTrees = require('broccoli-merge-trees')

function expand(input) {
  var path = p.dirname(input);
  var file = p.basename(input);

  return path + '/{' + file + '}';
}

module.exports = {
  name: 'ember-fetch',
  treeForVendor: function(tree) {
    var fetchPath = require.resolve('whatwg-fetch');
    var expandedFetchPath = expand(fetchPath);

    var fetch = rename(find(expandedFetchPath), function(path) {
      return 'whatwg-fetch/fetch.js'
    });

    return mergeTrees([
      new Template(fetch, templatePath, function variables(content) {
        return {
          moduleBody: content
        };
      })
    ]);
  },

  included: function(app) {
    this.app = app;
    this._super.included(app);

    app.import('vendor/whatwg-fetch/fetch.js', {
      exports: {
        default: [
          'default',
          'Headers',
          'Request',
          'Response'
        ]
      }
    });
  }
};
