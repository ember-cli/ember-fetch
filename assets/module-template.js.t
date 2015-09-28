define('fetch', [ 'ember', 'exports' ], function(Ember, self) {
  'use strict';
  var Promise = Ember['default'].RSVP.Promise;
  if (window.FormData) {
    self.FormData = window.FormData;
  }
  if (window.FileReader) {
    self.FileReader = window.FileReader; 
  }
  if (window.Blob) {
    self.Blob = window.Blob; 
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
