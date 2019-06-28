import Mixin from '@ember/object/mixin';
import { assign } from '@ember/polyfills';
import { deprecate } from '@ember/debug';
import RSVP, { reject } from 'rsvp';
import fetch from 'fetch';
import mungOptionsForFetch from '../utils/mung-options-for-fetch';
import determineBodyPromise from '../utils/determine-body-promise';
import DS from 'ember-data';
import Mix from '@ember/polyfills/types';
import { get } from '@ember/object';
import {
  PlainObject,
  PlainHeaders,
  Method,
  FetchOptions,
  Nullable,
  AjaxOptions
} from 'ember-fetch/types';
import { Fix } from '@ember/object/-private/types';

/**
 * Helper function to create a plain object from the response's Headers.
 * Consumed by the adapter's `handleResponse`.
 */
export function headersToObject(headers: Headers) {
  let headersObject: PlainObject<string> = {};

  if (headers) {
    headers.forEach((value, key) => (headersObject[key] = value));
  }

  return headersObject;
}

export interface FetchAdapter {
  headers: undefined | PlainHeaders;
  init(): void;
  ajaxOptions(url: string, type: Method, options: object): FetchOptions;
  ajax(url: string, type: Method, options: object): RSVP.Promise<void>;
  _ajaxRequest(
    options: Mix<RequestInit, { url: string }>
  ): RSVP.Promise<Response>;
  _fetchRequest(url: string, options: RequestInit): RSVP.Promise<Response>;
  ajaxSuccess(
    adapter: DS.RESTAdapter,
    response: Response,
    payload: Nullable<string | object>,
    requestData: { url: string; method: string }
  ): object | DS.AdapterError | RSVP.Promise<void>;
  parseFetchResponseForError(
    response: Response,
    payload: Nullable<object | string>
  ): object | string;
  ajaxError(
    adapter: any,
    response: Response,
    payload: Nullable<string | object>,
    requestData: object,
    error?: Error
  ): Error | object | DS.AdapterError;
}

export default Mixin.create<FetchAdapter, DS.RESTAdapter>({
  headers: undefined,

  init() {
    this._super(...arguments);
    deprecate('FetchAdapter is deprecated, it is no longer required for ember-data>=3.9.2', false, {
      id: 'deprecate-fetch-ember-data-support',
      until: '7.0.0'
    });
  },

  /**
   * @override
   */
  ajaxOptions(url: string, type: Method, options: object): FetchOptions {
    let hash = (options || {}) as AjaxOptions;
    hash.url = url;
    hash.type = type;

    // Add headers set on the Adapter
    let adapterHeaders = get(this, 'headers');
    if (adapterHeaders) {
      hash.headers = assign(hash.headers || {}, adapterHeaders);
    }

    const mungedOptions = mungOptionsForFetch(hash);

    // Mimics the default behavior in Ember Data's `ajaxOptions`, namely to set the
    // 'Content-Type' header to application/json if it is not a GET request and it has a body.
    if (
      mungedOptions.method !== 'GET' &&
      mungedOptions.body &&
      (mungedOptions.headers === undefined ||
        !(
          mungedOptions.headers['Content-Type'] ||
          mungedOptions.headers['content-type']
        ))
    ) {
      mungedOptions.headers = mungedOptions.headers || {};
      mungedOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    return mungedOptions;
  },

  /**
   * @override
   */
  ajax(url: string, type: Method, options: object) {
    const requestData = {
      url,
      method: type
    };

    const hash = this.ajaxOptions(url, type, options);

    return (
      this._ajaxRequest(hash)
        // @ts-ignore
        .catch((error, response, requestData) => {
          throw this.ajaxError(this, response, null, requestData, error);
        })
        .then((response: Response) => {
          return RSVP.hash({
            response,
            payload: determineBodyPromise(response, requestData)
          });
        })
        .then(
          ({
            response,
            payload
          }: {
            response: Response;
            payload: string | object | undefined;
          }) => {
            if (response.ok) {
              return this.ajaxSuccess(this, response, payload, requestData);
            } else {
              throw this.ajaxError(this, response, payload, requestData);
            }
          }
        )
    );
  },

  /**
   * Overrides the `_ajaxRequest` method to use `fetch` instead of jQuery.ajax
   * @override
   */
  _ajaxRequest(
    options: Mix<RequestInit, { url: string }>
  ): RSVP.Promise<Response> {
    return this._fetchRequest(options.url, options);
  },

  /**
   * A hook into where `fetch` is called.
   * Useful if you want to override this behavior, for example to multiplex requests.
   */
  _fetchRequest(url: string, options: RequestInit): RSVP.Promise<Response> {
    return fetch(url, options);
  },

  /**
   * @override
   */
  ajaxSuccess(
    adapter: DS.RESTAdapter,
    response: Response,
    payload: Nullable<string | object>,
    requestData: { url: string; method: string }
  ): object | DS.AdapterError | RSVP.Promise<void> {
    const returnResponse = adapter.handleResponse(
      response.status,
      headersToObject(response.headers),
      // TODO: DS.RESTAdapter annotates payload: {}
      // @ts-ignore
      payload,
      requestData
    );

    // TODO: DS.RESTAdapter annotates response: {}
    // @ts-ignore
    if (returnResponse && returnResponse.isAdapterError) {
      return reject(returnResponse);
    } else {
      return returnResponse;
    }
  },

  /**
   * Allows for the error to be selected from either the
   * response object, or the response data.
   */
  parseFetchResponseForError(
    response: Response,
    payload: Nullable<object | string>
  ): object | string {
    return payload || response.statusText;
  },

  /**
   * @override
   */
  ajaxError(
    adapter: Fix<FetchAdapter & DS.RESTAdapter>,
    response: Response,
    payload: Nullable<string | object>,
    requestData: object,
    error?: Error
  ): Error | object | DS.AdapterError {
    if (error) {
      return error;
    } else {
      const parsedResponse = adapter.parseFetchResponseForError(
        response,
        payload
      );
      return adapter.handleResponse(
        response.status,
        headersToObject(response.headers),
        // TODO: parseErrorResponse is DS.RESTAdapter private API
        // @ts-ignore
        adapter.parseErrorResponse(parsedResponse) || payload,
        requestData
      );
    }
  }
});
