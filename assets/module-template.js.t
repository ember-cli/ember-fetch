define('fetch', [ 'ember', 'exports' ], function(Ember, self) {
  'use strict';
  var Promise = Ember['default'].RSVP.Promise;

  <%= moduleBody %>

  self['default'] = self.fetch;
});
