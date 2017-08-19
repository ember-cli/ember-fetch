(function (global) {
  define('fetch', ['exports'], function(self) {
    'use strict';
    var Promise = global.Ember.RSVP.Promise;
    if (global.FormData) {
      self.FormData = global.FormData;
    }
    if (global.FileReader) {
      self.FileReader = global.FileReader;
    }
    if (global.Blob) {
      self.Blob = global.Blob;
    }

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

        return self.fetch.apply(self, arguments).then(function(response){
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

    self['Headers'] = self.Headers;
    self['Request'] = self.Request;
    self['Response'] = self.Response;
  });

  define('fetch/ajax', ['exports'], function() {
    throw new Error('You included `fetch/ajax` but it was renamed to `ember-fetch/ajax`');
  });
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this));
