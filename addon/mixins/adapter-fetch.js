import Ember from 'ember';
import fetch from 'fetch';

const {
  assign,
  merge,
  RSVP
} = Ember;

const RBRACKET = /\[\]$/;

/**
 * Helper function that turns the data/body of a request into a query param string.
 * This is directly copied from jQuery.param.
 * @param {Object} queryParamsObject
 * @returns {String}
 */
export function serialiazeQueryParams(queryParamsObject) {
  var s = [];

  function buildParams(prefix, obj) {
    var i, len, key;

    if (prefix) {
      if (Array.isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
          if (RBRACKET.test(prefix)) {
            add(s, prefix, obj[i]);
          } else {
            buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
          }
        }
      } else if (obj && String(obj) === '[object Object]') {
        for (key in obj) {
          buildParams(prefix + '[' + key + ']', obj[key]);
        }
      } else {
        add(s, prefix, obj);
      }
    } else if (Array.isArray(obj)) {
      for (i = 0, len = obj.length; i < len; i++) {
        add(s, obj[i].name, obj[i].value);
      }
    } else {
      for (key in obj) {
        buildParams(key, obj[key]);
      }
    }
    return s;
  }

  return buildParams('', queryParamsObject).join('&').replace(/%20/g, '+');
}

/**
 * Part of the `serialiazeQueryParams` helper function.
 * @param {Array} s
 * @param {String} k
 * @param {String} v
 */
function add(s, k, v) {
  v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
  s[s.length] = `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
}

/**
 * Helper function to create a plain object from the response's Headers.
 * Consumed by the adapter's `handleResponse`.
 * @param {Headers} headers
 * @returns {Object}
 */
export function headersToObject(headers) {
  let headersObject = {};
  headers.forEach((value, key) => headersObject[key] = value);
  return headersObject;
}
/**
 * Helper function that translates the options passed to `jQuery.ajax` into a format that `fetch` expects.
 * @param {Object} options
 */
export function mungOptionsForFetch(_options, adapter) {
  // This allows this mixin to be backward compatible with Ember < 2.5.
  const combineObjs = (assign || merge);
  const options = combineObjs({
    credentials: 'same-origin',
  }, _options);

  let adapterHeaders = adapter.get('headers');
  if (adapterHeaders) {
    // This double use of `combineObjs` is necessary because `merge` only accepts two arguments.
    options.headers = combineObjs(combineObjs({}, options.headers || {}), adapterHeaders);
  }
  options.method = options.type;

  // Mimics the default behavior in Ember Data's `ajaxOptions`
  if (options.headers === undefined || !(options.headers['Content-Type'] || options.headers['content-type'])) {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/json; charset=utf-8';
  }

  // GET and HEAD requests can't have a `body`
  if (options.data && Object.keys(options.data).length) {
    if (options.method === 'GET' || options.method === 'HEAD') {
      options.url += `?${serialiazeQueryParams(options.data)}`;
    } else {
      options.body = options.data;
    }
  }

  return options;
}
/**
 * Function that determines what sort of Promise to return for the response's body.
 * If the response has a status code of 204 (No Content) or 205 (Reset Content) or if the request method was 'HEAD',
 * it has no body and we should return a Promise that resolves to an object with 'data' set to null.
 * Otherwise, it returns a Promise that resolves to the JSON body of the response.
 * This check is necessary because calling `json` on an empty body will cause JSON.parse to throw an error.
 * @param {Response} response
 * @param {Object} requestData
 * @returns {Promise}
 */
export function determineBodyPromise(response, requestData) {
  let bodyPromise;
  const status = response.status;

  if (status === 204 || status === 205 || requestData.method === 'HEAD') {
    bodyPromise = RSVP.Promise.resolve({data: null});
  } else {
    bodyPromise = response.json();
  }
  return bodyPromise;
}

export default Ember.Mixin.create({
  /**
   * @param {String} url
   * @param {String} type
   * @param {Object} options
   * @override
   */
  ajax(url, type, options) {
    const requestData = {
      url,
      method: type,
    };

    const hash = this.ajaxOptions(url, type, options);

    return this._ajaxRequest(hash)
      .catch((error, response, requestData) => {
        throw this.ajaxError(error, response, requestData);
      })
      .then((response) => {
        if (response.ok) {
          const bodyPromise = determineBodyPromise(response, requestData);
          return this.ajaxSuccess(response, bodyPromise, requestData);
        }
        throw this.ajaxError(null, response, requestData);
      });
  },
  /**
   * Overrides the `_ajaxRequest` method to use `fetch` instead of jQuery.ajax
   * @param {Object} options
   * @override
   */
  _ajaxRequest(options) {
    const _options = mungOptionsForFetch(options, this);
    return fetch(_options.url, _options);
  },

  /**
   * @param {Object} response
   * @param {Promise} bodyPromise
   * @param {Object} requestData
   * @override
   */
  ajaxSuccess(response, bodyPromise, requestData) {
    const headersObject = headersToObject(response.headers);

    return bodyPromise.then((body) => {
      const returnResponse = this.handleResponse(
        response.status,
        headersObject,
        body,
        requestData
      );

      if (returnResponse && returnResponse.isAdapterError) {
        return RSVP.Promise.reject(returnResponse);
      } else {
        return returnResponse;
      }
    });
  },

  /**
   * @param {Error} error
   * @param {Object} response
   * @param {Object} requestData
   */
  ajaxError(error, response, requestData) {
    if (error instanceof Error) {
      return error;
    } else {
       return this.handleResponse(
        response.status,
         headersToObject(response.headers),
        this.parseErrorResponse(response.statusText) || error,
        requestData
      );
    }
  }
});
