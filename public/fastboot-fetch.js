/* globals define FastBoot */
(function() {
  define('fetch', ['exports'], function(self) {
    var AbortControllerPolyfill = FastBoot.require('abortcontroller-polyfill/dist/cjs-ponyfill');
    var nodeFetch = FastBoot.require('node-fetch');
    var abortableFetch = AbortControllerPolyfill.abortableFetch({
      fetch: nodeFetch,
      Request: nodeFetch.Request
    });

    self['default'] = abortableFetch.fetch;
    self['Request'] = abortableFetch.Request;

    self['Headers'] = nodeFetch.Headers;    
    self['Response'] = nodeFetch.Response;

    self['AbortController'] = AbortControllerPolyfill.AbortController;
  });

  define('fetch/ajax', ['exports'], function() {
    throw new Error('You included `fetch/ajax` but it was renamed to `ember-fetch/ajax`');
  });
})();
