/* globals define FastBoot */
define('fetch/setup', ['exports'], function(self) {
  var httpRegex = /^https?:\/\//;
  var protocolRelativeRegex = /^\/\//;

  var AbortControllerPolyfill = FastBoot.require(
    'abortcontroller-polyfill/dist/cjs-ponyfill'
  );
  var nodeFetch = FastBoot.require('node-fetch');

  self['default'] = function(protocol, host) {
    return function() {
      define('fetch', ['exports'], function(exports) {
        function buildAbsoluteUrl(url, protocol, host) {
          if (protocolRelativeRegex.test(url)) {
            url = host + url;
          } else if (!httpRegex.test(url)) {
            if (!host) {
              throw new Error(
                'You are using using fetch with a path-relative URL, but host is missing from Fastboot request. Please set the hostWhitelist property in your environment.js.'
              );
            }
            url = protocol + '//' + host + url;
          }
          return url;
        }
        /**
         * Setup the exported fetch for a given origin so it can handle:
         * - protocol-relative URL (//can-be-http-or-https.com/)
         * - path-relative URL (/file/under/root)
         * @param {String|Object} input
         * @param {Object} [options]
         */
        exports['default'] = function fetch(input, options) {
          if (typeof input === 'object') {
            input.url = buildAbsoluteUrl(input.url, protocol, host);
          } else {
            input = buildAbsoluteUrl(input, protocol, host);
          }
          return nodeFetch(input, options);
        };
        exports['Request'] = nodeFetch.Request;
        exports['Headers'] = nodeFetch.Headers;
        exports['Response'] = nodeFetch.Response;
        exports['AbortController'] = AbortControllerPolyfill.AbortController;
      });
    };
  };
});

define('fetch/ajax', ['exports'], function() {
  throw new Error(
    'You included `fetch/ajax` but it was renamed to `ember-fetch/ajax`'
  );
});
