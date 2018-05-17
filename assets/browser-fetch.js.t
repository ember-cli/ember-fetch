(function (global) {
  define('fetch', ['exports'], function(self) {
    'use strict';
    var Promise = global.Ember.RSVP.Promise;
    var supportProps = [
      'FormData',
      'FileReader',
      'Blob',
      'URLSearchParams',
      'Symbol',
      'ArrayBuffer'
    ];
    var polyfillProps = [
      'fetch',
      'Headers',
      'Request',
      'Response'
    ];
    var combinedProps = supportProps;
    if (!forcePolyfill) {
      combinedProps = supportProps.concat(polyfillProps);
    }
    combinedProps.forEach(function(prop) {
      if (global[prop]) {
        self[prop] = global[prop];
      }
    });

    var window = self;

    <%= moduleBody %>

    var pending = 0;
    function decrement(result) {
      pending--;
      return result;
    }

    if (global.Ember.Test) {
      global.Ember.Test.registerWaiter(function() {
        return pending === 0;
      });

      self['default'] = function() {
        pending++;

        return self.fetch.apply(forcePolyfill ? self : global, arguments).then(function(response){
          response.clone().blob().then(decrement, decrement);
          return response;
        }, function(reason) {
          decrement(reason);
          throw reason;
        });
      };
    } else {
      self['default'] = self.fetch;
    }
    supportProps.forEach(function(prop) {
      delete self[prop];
    });
  });

  define('fetch/ajax', ['exports'], function() {
    throw new Error('You included `fetch/ajax` but it was renamed to `ember-fetch/ajax`');
  });
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this));
