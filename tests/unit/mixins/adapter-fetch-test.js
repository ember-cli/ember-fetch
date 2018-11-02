import EmberObject from '@ember/object';
import { Promise } from 'rsvp';
import DS from 'ember-data';
import { module, test } from 'qunit';
import { Headers, Response } from 'fetch';
import AdapterFetchMixin, {
  mungOptionsForFetch,
  headersToObject,
  determineBodyPromise
} from 'ember-fetch/mixins/adapter-fetch';

const { JSONAPIAdapter } = DS;

module('Unit | Mixin | adapter-fetch', function(hooks) {
  hooks.beforeEach(function() {
    this.JSONAPIAdapter = JSONAPIAdapter.extend(AdapterFetchMixin, {
      init() {
        this._super();
        this.headers = {
          'custom-header': 'foo'
        };
      }
    }).create();
    this.basicAdapter = EmberObject.extend(AdapterFetchMixin).create();
  });

  test('mungOptionsForFetch transforms jQuery-style options into fetch compatible options', function(assert) {
    assert.expect(2);

    const jQueryGetOptions = {
      url: 'https://emberjs.com',
      type: 'GET',
      headers: {
        'x-fake-header': 13,
        'Content-Type': 'application/vnd.api+json'
      },
      data: {
        a: 1,
        b: 2
      }
    };

    const fetchGetOptions = mungOptionsForFetch(
      jQueryGetOptions,
      this.JSONAPIAdapter
    );

    assert.deepEqual(
      fetchGetOptions,
      {
        credentials: 'same-origin',
        url: 'https://emberjs.com?a=1&b=2',
        method: 'GET',
        type: 'GET',
        headers: {
          'x-fake-header': 13,
          'custom-header': 'foo',
          'Content-Type': 'application/vnd.api+json'
        },
        data: {
          a: 1,
          b: 2
        }
      },
      "GET call's options are correct"
    );

    const jqueryPostOptions = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: { a: 1 }
    };

    const fetchPostOptions = mungOptionsForFetch(
      jqueryPostOptions,
      this.JSONAPIAdapter
    );
    assert.deepEqual(
      fetchPostOptions,
      {
        credentials: 'same-origin',
        url: 'https://emberjs.com',
        method: 'POST',
        type: 'POST',
        headers: {
          'custom-header': 'foo',
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: '{"a":1}',
        data: {
          a: 1
        }
      },
      "POST call's options are correct"
    );
  });

  test('mungOptionsForFetch adds a default "Content-Type" header if none is present', function(assert) {
    assert.expect(2);
    const optionsNoHeaders = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: { a: 1 }
    };
    const optionsHeadersWithoutContentType = {
      url: 'https://emberjs.com',
      type: 'POST',
      headers: {
        'X-foo': 'bar'
      },
      data: { a: 1 }
    };
    let options = mungOptionsForFetch(optionsNoHeaders, this.basicAdapter);
    assert.deepEqual(
      options.headers,
      {
        'Content-Type': 'application/json; charset=utf-8'
      },
      "POST call's options without a headers object now has a headers object which has a content-type header"
    );

    options = mungOptionsForFetch(
      optionsHeadersWithoutContentType,
      this.basicAdapter
    );
    assert.deepEqual(
      options.headers,
      {
        'Content-Type': 'application/json; charset=utf-8',
        'X-foo': 'bar'
      },
      "POST call's options with a headers object now has a content-type header"
    );
  });

  test('mungOptionsForFetch does not add a "Content-Type" header if it is a GET request', function(assert) {
    assert.expect(1);
    const getOptions = {
      url: 'https://emberjs.com',
      type: 'GET',
      headers: {
        foo: 'bar'
      }
    };

    let options = mungOptionsForFetch(getOptions, this.basicAdapter);
    assert.deepEqual(
      options.headers,
      {
        foo: 'bar'
      },
      "GET call's options has no added content-type header"
    );
  });

  test('mungOptionsForFetch does not add a "Content-Type" header if a POST request has no body', function(assert) {
    assert.expect(1);
    const PostNoDataOptions = {
      url: 'https://emberjs.com',
      type: 'GET',
      headers: {
        foo: 'bar'
      }
    };

    let options = mungOptionsForFetch(PostNoDataOptions, this.basicAdapter);
    assert.deepEqual(
      options.headers,
      {
        foo: 'bar'
      },
      'POST call with no body has no added content-type header'
    );
  });

  test('mungOptionsForFetch respects the "Content-Type" header if present', function(assert) {
    assert.expect(1);
    const optionsHeadersWithContentType = {
      url: 'https://emberjs.com',
      type: 'POST',
      headers: {
        'Content-Type': 'application/special-type'
      },
      data: { a: 1 }
    };

    let options = mungOptionsForFetch(
      optionsHeadersWithContentType,
      this.basicAdapter
    );
    assert.deepEqual(
      options.headers,
      {
        'Content-Type': 'application/special-type'
      },
      "POST call's options has the original content-type header"
    );
  });

  test('mungOptionsForFetch takes the headers from the adapter if present', function(assert) {
    assert.expect(1);
    const optionsHeadersWithoutContentType = {
      url: 'https://emberjs.com',
      type: 'POST',
      headers: {
        'X-foo': 'bar'
      },
      data: { a: 1 }
    };

    let options = mungOptionsForFetch(
      optionsHeadersWithoutContentType,
      this.JSONAPIAdapter
    );
    assert.deepEqual(
      options.headers,
      {
        'Content-Type': 'application/json; charset=utf-8',
        'X-foo': 'bar',
        'custom-header': 'foo'
      },
      "POST call's options are correct"
    );
  });

  test('mungOptionsForFetch sets the method to "GET" if `type` is not provided', function(assert) {
    assert.expect(1);
    const getOptions = {
      url: 'https://emberjs.com',
      type: undefined
    };

    const options = mungOptionsForFetch(getOptions, this.basicAdapter);
    assert.equal(options.method, 'GET');
  });

  test('mungOptionsForFetch adds string query params to the url correctly', function(assert) {
    assert.expect(2);

    const baseUrl = 'https://emberjs.com';
    const noQueryStringOptions = {
      url: baseUrl,
      data: { a: 1, b: 2 }
    };

    let options = mungOptionsForFetch(noQueryStringOptions, this.basicAdapter);
    assert.equal(
      options.url,
      `${baseUrl}?a=1&b=2`,
      'url that started without query params has query params'
    );

    const hasQueryStringOptions = {
      url: `${baseUrl}?fastboot=true`,
      data: { a: 1, b: 2 }
    };

    options = mungOptionsForFetch(hasQueryStringOptions, this.basicAdapter);
    assert.equal(
      options.url,
      `${baseUrl}?fastboot=true&a=1&b=2`,
      'url that started with query params has more query params'
    );
  });

  test("mungOptionsForFetch removes undefined query params when method is POST and 'data' is an object", function(assert) {
    assert.expect(1);

    const dataAsObject = {
      a: 1,
      b: undefined,
      c: 3,
      d: null,
      e: 0,
      f: false
    };

    const undefinedQueryStringOptions = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: dataAsObject
    };

    let options = mungOptionsForFetch(
      undefinedQueryStringOptions,
      this.basicAdapter
    );
    assert.deepEqual(options.body, '{"a":1,"c":3,"d":null,"e":0,"f":false}');
  });

  test('mungOptionsForFetch sets the request body correctly when the method is not GET or HEAD', function(assert) {
    assert.expect(3);

    const baseOptions = {
      url: '/',
      type: 'POST',
      data: { a: 1 }
    };

    // Tests POST method.
    let options = mungOptionsForFetch(baseOptions, this.basicAdapter);
    assert.equal(
      options.body,
      JSON.stringify(baseOptions.data),
      'POST request body correctly set'
    );

    // Tests PUT method.
    baseOptions.type = 'PUT';
    options = mungOptionsForFetch(baseOptions, this.basicAdapter);
    assert.equal(
      options.body,
      JSON.stringify(baseOptions.data),
      'PUT request body correctly set'
    );

    // Tests DELETE method.
    baseOptions.type = 'DELETE';
    options = mungOptionsForFetch(baseOptions, this.basicAdapter);
    assert.equal(
      options.body,
      JSON.stringify(baseOptions.data),
      'DELETE request has the correct body'
    );
  });

  test("mungOptionsForFetch sets the request body correctly when the method is POST and 'data' is a string", function(assert) {
    assert.expect(1);

    // Tests stringified objects.
    const stringifiedData = JSON.stringify({ a: 1, b: 2 });
    const optionsWithStringData = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: stringifiedData
    };

    let options = mungOptionsForFetch(optionsWithStringData, this.basicAdapter);
    // data should not be stringified twice
    assert.deepEqual(options.body, stringifiedData);
  });

  test('mungOptionsForFetch does not set a request body when the method is GET or HEAD', function(assert) {
    assert.expect(4);

    const baseOptions = {
      url: '/',
      type: 'GET',
      data: { a: 1 }
    };

    let options = mungOptionsForFetch(baseOptions, this.basicAdapter);
    assert.equal(
      options.body,
      undefined,
      'GET request does not have a request body'
    );

    baseOptions.type = 'HEAD';
    options = mungOptionsForFetch(baseOptions, this.basicAdapter);
    assert.equal(
      options.body,
      undefined,
      'HEAD request does not have a request body'
    );

    baseOptions.data = {};
    options = mungOptionsForFetch(baseOptions, this.basicAdapter);
    assert.equal(
      options.body,
      undefined,
      'HEAD request does not have a request body when `data` is an empty object'
    );

    baseOptions.type = 'GET';
    options = mungOptionsForFetch(baseOptions, this.basicAdapter);
    assert.equal(
      options.body,
      undefined,
      'GET request does not have a request body when `data` is an empty object'
    );
  });

  test("mungOptionsForFetch correctly processes an empty 'data' object", function(assert) {
    assert.expect(2);

    const getData = {
      url: 'https://emberjs.com',
      type: 'GET',
      data: {}
    };

    const getOptions = mungOptionsForFetch(getData, this.basicAdapter);
    assert.equal(
      getOptions.url.indexOf('?'),
      -1,
      'A question mark is not added if there are no query params to add'
    );

    const postData = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: {}
    };

    const postOptions = mungOptionsForFetch(postData, this.basicAdapter);
    assert.equal(postOptions.body, '{}', "'options.body' is an empty object");
  });

  test('headersToObject turns an Headers instance into an object', function(assert) {
    assert.expect(1);

    const exampleHeaders = { etag: 'abc123' };
    const headers = new Headers(exampleHeaders);
    const headerObject = headersToObject(headers);

    assert.deepEqual(headerObject, exampleHeaders);
  });

  test('headersToObject returns an empty object if no headers are passed to it', function(assert) {
    assert.expect(1);

    const headerObject = headersToObject();
    assert.deepEqual(headerObject, {});
  });

  test('determineBodyResponse returns the body when it is present', function(assert) {
    assert.expect(1);

    const response = new Response('{"data": "foo"}', { status: 200 });
    const bodyPromise = determineBodyPromise(response, {});

    return bodyPromise.then(body => {
      assert.deepEqual(body, { data: 'foo' });
    });
  });

  test('determineBodyResponse returns the body even if it is not json', function(assert) {
    assert.expect(1);

    const response = new Response('this is not json', { status: 200 });
    const bodyPromise = determineBodyPromise(response, {});

    return bodyPromise.then(body => {
      assert.deepEqual(body, 'this is not json');
    });
  });

  test('determineBodyResponse returns undefined when the http status code is 204', function(assert) {
    assert.expect(1);

    const response = new Response(null, { status: 204 });
    const bodyPromise = determineBodyPromise(response, {});

    return bodyPromise.then(body => {
      assert.deepEqual(body, undefined);
    });
  });

  test('determineBodyResponse returns undefined when the http status code is 205', function(assert) {
    assert.expect(1);

    const response = new Response(null, { status: 205 });
    const bodyPromise = determineBodyPromise(response, {});

    return bodyPromise.then(body => {
      assert.deepEqual(body, undefined);
    });
  });

  test("determineBodyResponse returns undefined when the request method is 'HEAD'", function(assert) {
    assert.expect(1);

    const response = new Response(null, { status: 200 });
    const bodyPromise = determineBodyPromise(response, { method: 'HEAD' });

    return bodyPromise.then(body => {
      assert.deepEqual(body, undefined);
    });
  });

  test('parseFetchResponseForError is able to be overwritten to mutate the error payload that gets passed along', function(assert) {
    assert.expect(1);

    this.errorAdapter = JSONAPIAdapter.extend(AdapterFetchMixin, {
      _fetchRequest() {
        const response = new Response(`{ "errors": ["myoneerror"] }`, {
          status: 422
        });
        return Promise.resolve(response);
      },
      parseFetchResponseForError() {
        return {
          errors: ['myOverWrittenError']
        };
      }
    }).create();

    const fetchReturn = this.errorAdapter.ajax(
      '/trigger-a-server-error-with-content'
    );

    return fetchReturn.catch(body => {
      assert.deepEqual(body.errors, ['myOverWrittenError']);
    });
  });

  test('able to handle empty error payloads', function(assert) {
    assert.expect(2);

    this.errorAdapter = JSONAPIAdapter.extend(AdapterFetchMixin, {
      _fetchRequest() {
        const response = new Response(``, { status: 500, statusText: 'Internal server error' });
        return Promise.resolve(response);
      }
    }).create();

    const fetchReturn = this.errorAdapter.ajax(
      '/trigger-an-empty-server-error'
    );

    return fetchReturn.catch(body => {
      const error = body.errors[0];
      assert.equal(error.status, '500');
      assert.equal(error.detail, 'Internal server error');
    });
  });

  test('default fetch hook is correctly called if not overriden', function(assert) {
    assert.expect(1);

    const fetchReturn = this.JSONAPIAdapter._ajaxRequest({});
    // if in pretender with native fetch testing, pretender will polyfill native fetch
    assert.ok(fetchReturn instanceof Promise || fetchReturn instanceof window.Promise);
  });

  test('overridden fetch hook is called when supplied', function(assert) {
    assert.expect(1);

    const newText = 'intercepted';
    this.JSONAPIAdapter._fetchRequest = () => newText;
    const fetchReturn = this.JSONAPIAdapter._ajaxRequest({});
    assert.equal(fetchReturn, newText);
  });

  test('ajaxOptions returns the correct data', function(assert) {
    assert.expect(1);

    const ajaxOptionsReturn = this.JSONAPIAdapter.ajaxOptions('/url', 'GET', {
      data: {
        a: 1
      },
      headers: {
        'secret-key': 1234
      }
    });

    assert.deepEqual(ajaxOptionsReturn, {
      url: '/url?a=1',
      method: 'GET',
      type: 'GET',
      credentials: 'same-origin',
      data: {
        a: 1
      },
      headers: {
        'custom-header': 'foo',
        'secret-key': 1234
      }
    });
  });
});
