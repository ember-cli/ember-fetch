define('fetch', [ 'ember', 'exports' ], function(Ember, self) {
  'use strict';
  var Promise = Ember['default'].RSVP.Promise;

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
