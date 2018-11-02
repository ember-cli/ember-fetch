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
