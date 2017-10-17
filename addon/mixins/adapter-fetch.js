import Ember from 'ember';
import fetch from 'fetch';

const {
  assign,
  merge,
  RSVP,
  Logger: { warn }
} = Ember;

const RBRACKET = /\[\]$/;

/**
 * Helper function that turns the data/body of a request into a query param string.
 * This is directly copied from jQuery.param.
 * @param {Object} queryParamsObject
 * @returns {String}
 */
export function serializeQueryParams(queryParamsObject) {
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
 * Part of the `serializeQueryParams` helper function.
 * @param {Array} s
 * @param {String} k
 * @param {String} v
 */
function add(s, k, v) {
  // Strip out keys with undefined or null values (mimics jQuery.ajax).
  if (v === undefined) {
    return;
  }

  v = typeof v === 'function' ? v() : v;
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

  if (headers) {
    headers.forEach((value, key) => headersObject[key] = value);
  }

  return headersObject;
}
/**
 * Helper function that translates the options passed to `jQuery.ajax` into a format that `fetch` expects.
 * @param {Object} _options
 * @param {DS.Adapter} adapter
 * @returns {Object}
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

  // Default to 'GET' in case `type` is not passed in (mimics jQuery.ajax).
  options.method = options.type || 'GET';

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
      options.body = JSON.stringify(options.data);
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
/**
 * Function that always attempts to parse the response as json, and if an error is thrown,
 * returns an object with 'data' set to null if the response is
 * a sucess and has a status code of 204 (No Content) or 205 (Reset Content) or if the request method was 'HEAD',
 * and the plain payload otherwise.
 * @param {Response} response
 * @param {Object} requestData
 * @returns {Promise}
 */
export function determineBodyPromise(response, requestData) {
  return response.text().then(function(payload) {
    try {
      payload = JSON.parse(payload);
    } catch(error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
      const status = response.status;
      if (response.ok && (status === 204 || status === 205 || requestData.method === 'HEAD')) {
        payload = { data: null };
      } else {
        warn('This response was unable to be parsed as json.', payload);
      }
    }
    return payload;
  });
}

export default Ember.Mixin.create({
/**
 * @param {String} url
 * @param {String} type
 * @param {Object} _options
 * @returns {Object}
 * @override
 */

  ajaxOptions(url, type, options = {}) {
    options.url = url;
    options.type = type;
    return mungOptionsForFetch(options, this);
  },

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
        throw this.ajaxError(this, response, null, requestData, error);
      })
      .then((response) => {
        return RSVP.hash({
          response,
          payload: determineBodyPromise(response, requestData)
        });
      })
      .then(({ response, payload }) => {
        if (response.ok) {
          return this.ajaxSuccess(this, response, payload, requestData);
        } else {
          throw this.ajaxError(this, response, payload, requestData);
        }
      });
  },

  /**
   * Overrides the `_ajaxRequest` method to use `fetch` instead of jQuery.ajax
   * @param {Object} options
   * @override
   */
  _ajaxRequest(options) {
    return this._fetchRequest(options.url, options);
  },

  /**
   * A hook into where `fetch` is called.
   * Useful if you want to override this behavior, for example to multiplex requests.
   * @param {String} url
   * @param {Object} options
   */
  _fetchRequest(url, options) {
    return fetch(url, options);
  },

  /**
   * @param {Object} adapter
   * @param {Object} response
   * @param {Object} payload
   * @param {Object} requestData
   * @override
   */
  ajaxSuccess(adapter, response, payload, requestData) {
    const returnResponse = adapter.handleResponse(
      response.status,
      headersToObject(response.headers),
      payload,
      requestData
    );

    if (returnResponse && returnResponse.isAdapterError) {
      return RSVP.Promise.reject(returnResponse);
    } else {
      return returnResponse;
    }
  },


/**
 * Allows for the error to be selected from either the
 * response object, or the response data.
 * @param {Object} response
 * @param {Object} payload
 */
  parseFetchResponseForError(response, payload) {
    return payload || response.statusTest;
  },

  /**
   * @param {Object} adapter
   * @param {Object} response
   * @param {String|Object} payload
   * @param {Object} requestData
   * @param {Error} error
   * @override
   */
  ajaxError(adapter, response, payload, requestData, error) {
    if (error) {
      return error;
    } else {
      const parsedResponse = adapter.parseFetchResponseForError(response, payload);
      return adapter.handleResponse(
        response.status,
        headersToObject(response.headers),
        adapter.parseErrorResponse(parsedResponse) || payload,
        requestData
      );
    }
  }
});
