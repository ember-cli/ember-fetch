import EmberObject from '@ember/object';
import { Promise } from 'rsvp';
import DS from 'ember-data';
import { module, test } from 'qunit';
import { Headers, Response } from 'fetch';
import AdapterFetchMixin, {
  headersToObject,
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

  test('mixin adds the headers from the adapter if present', function(assert) {
    assert.expect(1);
    const options = {
      url: 'https://emberjs.com',
      type: 'POST',
      headers: {
        'X-foo': 'bar'
      },
      data: { a: 1 }
    };

    let returnedOptions = this.JSONAPIAdapter.ajaxOptions(options.url, options.type, options);
    assert.deepEqual(
      returnedOptions.headers,
      {
        'Content-Type': 'application/json; charset=utf-8',
        'X-foo': 'bar',
        'custom-header': 'foo'
      },
      "POST call's options are correct"
    );
  });

  test('mixin adds a default "Content-Type" header if none is present', function(assert) {
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
    let options = this.JSONAPIAdapter.ajaxOptions(optionsNoHeaders.url, optionsNoHeaders.type, optionsNoHeaders);
    assert.deepEqual(
      options.headers,
      {
        'Content-Type': 'application/json; charset=utf-8',
        'custom-header': 'foo',
      },
      "POST call's options without a headers object now has a headers object which has a content-type header"
    );

    options = this.JSONAPIAdapter.ajaxOptions(
      optionsHeadersWithoutContentType.url,
      optionsHeadersWithoutContentType.type,
      optionsHeadersWithoutContentType
    );
    assert.deepEqual(
      options.headers,
      {
        'Content-Type': 'application/json; charset=utf-8',
        'X-foo': 'bar',
        'custom-header': 'foo',
      },
      "POST call's options with a headers object now has a content-type header"
    );
  });

  test('mixin does not add a "Content-Type" header if it is a GET request', function(assert) {
    assert.expect(1);
    const getOptions = {
      url: 'https://emberjs.com',
      type: 'GET',
      headers: {
        foo: 'bar'
      }
    };

    let options = this.JSONAPIAdapter.ajaxOptions(getOptions.url, getOptions.type, getOptions);
    assert.deepEqual(
      options.headers,
      {
        foo: 'bar',
        'custom-header': 'foo',
      },
      "GET call's options has no added content-type header"
    );
  });

  test('mixin does not add a "Content-Type" header if a POST request has no body', function(assert) {
    assert.expect(1);
    const postNoDataOptions = {
      url: 'https://emberjs.com',
      type: 'GET',
      headers: {
        foo: 'bar',
        'custom-header': 'foo',
      }
    };

    let options = this.JSONAPIAdapter.ajaxOptions(
      postNoDataOptions.url,
      postNoDataOptions.type,
      postNoDataOptions
    );
    assert.deepEqual(
      options.headers,
      {
        foo: 'bar',
        'custom-header': 'foo',
      },
      'POST call with no body has no added content-type header'
    );
  });

  test('mixin respects the "Content-Type" header if present', function(assert) {
    assert.expect(1);
    const optionsHeadersWithContentType = {
      url: 'https://emberjs.com',
      type: 'POST',
      headers: {
        'Content-Type': 'application/special-type'
      },
      data: { a: 1 }
    };

    let options = this.JSONAPIAdapter.ajaxOptions(
      optionsHeadersWithContentType.url,
      optionsHeadersWithContentType.type,
      optionsHeadersWithContentType
    );
    assert.deepEqual(
      options.headers,
      {
        'Content-Type': 'application/special-type',
        'custom-header': 'foo',
      },
      "POST call's options has the original content-type header"
    );
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
