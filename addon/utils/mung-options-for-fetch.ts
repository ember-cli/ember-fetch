import { assign } from '@ember/polyfills';
import { serializeQueryParams } from './serialize-query-params';
import {
  Method,
  FetchOptions,
  AjaxOptions,
  isPlainObject
} from 'ember-fetch/types';

/**
 * Helper function that translates the options passed to `jQuery.ajax` into a format that `fetch` expects.
 */
export default function mungOptionsForFetch(
  options: AjaxOptions
): FetchOptions {
  const hash = assign(
    {
      credentials: 'same-origin'
    },
    options
  ) as FetchOptions;

  // Default to 'GET' in case `type` is not passed in (mimics jQuery.ajax).
  hash.method = (hash.method || hash.type || 'GET').toUpperCase() as Method;

  if (hash.data) {
    // GET and HEAD requests can't have a `body`
    if (hash.method === 'GET' || hash.method === 'HEAD') {
      // If no options are passed, Ember Data sets `data` to an empty object, which we test for.
      if (Object.keys(hash.data).length) {
        // Test if there are already query params in the url (mimics jQuey.ajax).
        const queryParamDelimiter = hash.url.indexOf('?') > -1 ? '&' : '?';
        hash.url += `${queryParamDelimiter}${serializeQueryParams(hash.data)}`;
      }
    } else {
      // NOTE: a request's body cannot be a POJO, so we stringify it if it is.
      // JSON.stringify removes keys with values of `undefined` (mimics jQuery.ajax).
      // If the data is not a POJO (it's a String, FormData, etc), we just set it.
      // If the data is a string, we assume it's a stringified object.
      if (isPlainObject(hash.data)) {
        hash.body = JSON.stringify(hash.data);
      } else {
        hash.body = hash.data;
      }
    }
  }

  return hash;
}
