(function (global) {
  define('fetch', [ 'ember', 'exports' ], function(Ember, self) {
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
  
    self['default'] = self.fetch;
  });
  
  define('fetch/ajax', [ 'fetch', 'exports' ], function(fetch, exports) {
    'use strict';
  
    exports['default'] = function() {
      return fetch['default'].apply(fetch, arguments).then(function(request) {
        return request.json();
      });
    };
  });
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this));
