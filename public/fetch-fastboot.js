/* globals define FastBoot */
define('fetch', ['exports'], function(exports) {
  var httpRegex = /^https?:\/\//;
  var protocolRelativeRegex = /^\/\//;

  var AbortControllerPolyfill = FastBoot.require(
    'abortcontroller-polyfill/dist/cjs-ponyfill'
  );
  var nodeFetch = FastBoot.require('node-fetch');

  /**
   * Build the absolute url if it's not, can handle:
   * - protocol-relative URL (//can-be-http-or-https.com/)
   * - path-relative URL (/file/under/root)
   *
   * @param {string} url
   * @param {string} protocol
   * @param {string} host
   * @returns {string}
   */
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

  var FastbootHost, FastbootProtocol;

  class FastBootRequest extends nodeFetch.Request {
    constructor(input, init) {
      if (typeof input === 'string') {
        input = buildAbsoluteUrl(input, FastbootProtocol, FastbootHost);
      } else if (input && input.href) {
        // WHATWG URL or Node.js Url Object
        input = buildAbsoluteUrl(input.href, FastbootProtocol, FastbootHost);
      }
      super(input, init);
    }
  }

  /**
   * Isomorphic `fetch` API for both browser and fastboot
   *
   * node-fetch doesn't allow relative URLs, we patch it with Fastboot runtime info.
   * Before instance-initializers Absolute URL is still not allowed, in this case
   * node-fetch will throw error.
   * `FastbootProtocol` and `FastbootHost` are re-set for every instance during its
   * initializers through calling `setupFastboot`.
   *
   * @param {String|Object} input
   * @param {Object} [options]
   */
  exports.default = function fetch(input, options) {
    if (input && input.href) {
      input.url = buildAbsoluteUrl(input.href, FastbootProtocol, FastbootHost);
    } else if (typeof input === 'string') {
      input = buildAbsoluteUrl(input, FastbootProtocol, FastbootHost);
    }
    return nodeFetch(input, options);
  };
  /**
   * Assign the local protocol and host being used for building absolute URLs
   * @private
   */
  exports.setupFastboot = function setupFastboot(protocol, host) {
    FastbootProtocol = protocol;
    FastbootHost = host;
  }
  exports.Request = FastBootRequest;
  exports.Headers = nodeFetch.Headers;
  exports.Response = nodeFetch.Response;
  exports.AbortController = AbortControllerPolyfill.AbortController;
});

define('fetch/ajax', ['exports'], function() {
  throw new Error(
    'You included `fetch/ajax` but it was renamed to `ember-fetch/ajax`'
  );
});
