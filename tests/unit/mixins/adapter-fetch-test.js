import Ember from 'ember';
import { module, test } from 'qunit';
import { Headers } from 'fetch';
import AdapterFetchMixin, {
  mungOptionsForFetch,
  headersToObject,
  serialiazeQueryParams
} from 'ember-fetch/mixins/adapter-fetch';

module('Unit | Mixin | adapter-fetch', {
  beforeEach() {
    this.subject = Ember.Object.extend(AdapterFetchMixin).create();
  }
});

test('mungOptionsForFetch transforms jQuery-style options into fetch compatible options', function(assert) {
  assert.expect(2);

  const jQueryGetOptions = {
    url: 'https://emberjs.com',
    type: 'GET',
    headers: {
      'x-fake-header': 13
    },
    data: {
      a: 1,
      b: 2
    }
  };

  const fetchGetOptions = mungOptionsForFetch(jQueryGetOptions);

  assert.deepEqual(fetchGetOptions, {
    credentials: 'same-origin',
    url: 'https://emberjs.com?a=1&b=2',
    method: 'GET',
    type: 'GET',
    headers: {
      'x-fake-header': 13,
      "Content-Type": "application/json; charset=utf-8"
    },
    data: {
      a: 1,
      b: 2
    }
  }, 'GET call\'s options are correct');

  const jqueryPostOptions = {
    url: 'https://emberjs.com',
    type: 'POST',
    data: { a: 1 }
  };

  const fetchPostOptions = mungOptionsForFetch(jqueryPostOptions);

  assert.deepEqual(fetchPostOptions, {
    credentials: 'same-origin',
    url: 'https://emberjs.com',
    method: 'POST',
    type: 'POST',
    body: {
      a: 1
    },
    data: {
      a: 1
    },
  }, 'POST call\'s options are correct');
});

test('headersToObject turns an Headers instance into an object', function (assert) {
  assert.expect(1);

  const exampleHeaders = { etag: 'abc123' };
  const headers = new Headers(exampleHeaders);
  const headerObject = headersToObject(headers);

  assert.deepEqual(headerObject, exampleHeaders);
});

test('serialiazeQueryParams turns deeply nested objects into queryParams like $.param', function (assert) {
  assert.expect(1);

  const body = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: {
        f: 4
      },
      g: [5,6,7]
    }
  };
  const queryParamString = serialiazeQueryParams(body);

  assert.equal(queryParamString, 'a=1&b=2&c%5Bd%5D=3&c%5Be%5D%5Bf%5D=4&c%5Bg%5D%5B%5D=5&c%5Bg%5D%5B%5D=6&c%5Bg%5D%5B%5D=7');
});
