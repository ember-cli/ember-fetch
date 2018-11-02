import { assign } from '@ember/polyfills'
import { serializeQueryParams } from '../utils/serialize-query-params';

/**
 * Helper function that translates the options passed to `jQuery.ajax` into a format that `fetch` expects.
 * @param {Object} _options
 * @returns {Object}
 */
export default function mungOptionsForFetch(_options) {
  const options = assign({
    credentials: 'same-origin',
  }, _options);

  // Default to 'GET' in case `type` is not passed in (mimics jQuery.ajax).
  options.method = options.method || options.type || 'GET';

  if (options.data) {
    // GET and HEAD requests can't have a `body`
    if ((options.method === 'GET' || options.method === 'HEAD')) {
      // If no options are passed, Ember Data sets `data` to an empty object, which we test for.
      if (Object.keys(options.data).length) {
        // Test if there are already query params in the url (mimics jQuey.ajax).
        const queryParamDelimiter = options.url.indexOf('?') > -1 ? '&' : '?';
        options.url += `${queryParamDelimiter}${serializeQueryParams(options.data)}`;
      }
    } else {
      // NOTE: a request's body cannot be an object, so we stringify it if it is.
      // JSON.stringify removes keys with values of `undefined` (mimics jQuery.ajax).
      // If the data is already a string, we assume it's already been stringified.
      options.body = typeof options.data !== 'string' ? JSON.stringify(options.data) : options.data;
    }
  }

  // Mimics the default behavior in Ember Data's `ajaxOptions`, namely to set the
  // 'Content-Type' header to application/json if it is not a GET request and it has a body.
  if (options.method !== 'GET' && options.body && (options.headers === undefined || !(options.headers['Content-Type'] || options.headers['content-type']))) {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/json; charset=utf-8';
  }

  return options;
}