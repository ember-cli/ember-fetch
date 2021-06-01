(function (originalGlobal) {
  <%= moduleHeader %>
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
      'Response',
      'AbortController'
    ];
    var combinedProps = supportProps;
    if (preferNative) {
      combinedProps = supportProps.concat(polyfillProps);
    }
    combinedProps.forEach(function(prop) {
      if (originalGlobal[prop]) {
        Object.defineProperty(exports, prop, {
          configurable: true,
          get: function() { return originalGlobal[prop] },
          set: function(v) { originalGlobal[prop] = v }
        });
      }
    });

    // shadow github/fetch global object
    // https://github.com/github/fetch/blob/v3.4.0/fetch.js
    var globalThis =  exports;
    // shadow mo/abortcontroller-polyfill global object
    // https://github.com/mo/abortcontroller-polyfill/blob/v1.4.0/src/abortcontroller-polyfill.js
    var self = exports;
    <%= moduleBody %>

    if (!globalThis.fetch) {
      throw new Error('fetch is not defined - maybe your browser targets are not covering everything you need?');
    }

    var pending = 0;
    function decrement(result) {
      pending--;
      return result;
    }

    if (Ember.Test) {
      Ember.Test.registerWaiter(function() {
        return pending === 0;
      });

      exports['default'] = function() {
        pending++;

        return exports.fetch.apply(originalGlobal, arguments).then(function(response){
          response.clone().blob().then(decrement, decrement);
          return response;
        }, function(reason) {
          decrement(reason);
          throw reason;
        });
      };
    } else {
      exports['default'] = exports.fetch;
    }
    supportProps.forEach(function(prop) {
      delete exports[prop];
    });
  });
}((typeof window !== 'undefined' && window) ||
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  (typeof global !== 'undefined' && global)));
