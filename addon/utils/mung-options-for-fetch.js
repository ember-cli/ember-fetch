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
  options.method = (options.method || options.type || 'GET').toUpperCase();

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
      // NOTE: a request's body cannot be a POJO, so we stringify it if it is.
      // JSON.stringify removes keys with values of `undefined` (mimics jQuery.ajax).
      // If the data is not a POJO (it's a String, FormData, etc), we just set it.
      // If the data is a string, we assume it's a stringified object.
      if (Object.prototype.toString.call(options.data) === "[object Object]") {
        options.body = JSON.stringify(options.data);
      } else {
        options.body = options.data;
      }
    }
  }

  return options;
}
