(function (global) {
  define('fetch', ['ember', 'exports'], function(Ember, self) {
    'use strict';
    var Promise = Ember['default'].RSVP.Promise;
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
    if (Ember.Test) {
      Ember.Test.registerWaiter(function() { return pending === 0; });
    }

    function decrement(result) {
      pending--;
      return result;
    }

    self['default'] = function() {
      pending++;

      return self.fetch.apply(self, arguments).then(decrement, decrement);
    };
    self['Headers'] = self.Headers;
    self['Request'] = self.Request;
    self['Response'] = self.Response;
  });

  define('fetch/ajax', ['exports'], function() {
    throw new Error('You included `fetch/ajax` but it was renamed to `ember-fetch/ajax`');
  });
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this));
