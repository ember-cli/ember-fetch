(function() {
  define('fetch', ['exports'], function(self) {
    var fetch = FastBoot.require('node-fetch');
    self['default'] = fetch;
    self['Headers'] = fetch.Headers;
    self['Request'] = fetch.Request;
    self['Response'] = fetch.Response;
  });

  define('fetch/ajax', ['exports'], function() {
    throw new Error('You included `fetch/ajax` but it was renamed to `ember-fetch/ajax`');
  });
})();
