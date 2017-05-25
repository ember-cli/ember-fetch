(function (global) {
  define('fetch', ['ember', 'exports'], function(Ember, exp) {
    'use strict';
    var Promise = Ember['default'].RSVP.Promise;
    if (global.FormData) {
      exp.FormData = global.FormData;
    }
    if (global.FileReader) {
      exp.FileReader = global.FileReader;
    }
    if (global.Blob) {
      exp.Blob = global.Blob;
    }

    <%= moduleBody %>

    exp['default'] = self.fetch;
    exp['Headers'] = self.Headers;
    exp['Request'] = self.Request;
    exp['Response'] = self.Response;
  });

  define('fetch/ajax', ['exports'], function() {
    throw new Error('You included `fetch/ajax` but it was renamed to `ember-fetch/ajax`');
  });
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this));
