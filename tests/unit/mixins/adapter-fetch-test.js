import Ember from 'ember';
import DS from 'ember-data';
import { module, test } from 'qunit';
import { Headers } from 'fetch';
import AdapterFetchMixin, {
  mungOptionsForFetch,
  headersToObject,
  serialiazeQueryParams
} from 'ember-fetch/mixins/adapter-fetch';
const { JSONAPIAdapter } = DS;


module('Unit | Mixin | adapter-fetch', {
  beforeEach() {
    this.JSONAPIAdapter = JSONAPIAdapter.extend(AdapterFetchMixin, {
      headers: {
        'custom-header' : 'foo',
        'Content-Type': 'application/vnd.api+json'
      }
    }).create();
    this.basicAdapter = Ember.Object.extend(AdapterFetchMixin).create();
  }
});

test('mungOptionsForFetch transforms jQuery-style options into fetch compatible options', function(assert) {
  assert.expect(2);

  const jQueryGetOptions = {
    url: 'https://emberjs.com',
    type: 'GET',
    headers: {
      'x-fake-header': 13,
      "Content-Type": 'application/vnd.api+json'
    },
    data: {
      a: 1,
      b: 2
    }
  };

  const fetchGetOptions = mungOptionsForFetch(jQueryGetOptions, this.JSONAPIAdapter);

  assert.deepEqual(fetchGetOptions, {
    credentials: 'same-origin',
    url: 'https://emberjs.com?a=1&b=2',
    method: 'GET',
    type: 'GET',
    headers: {
      'x-fake-header': 13,
      'custom-header' : 'foo',
      'Content-Type': 'application/vnd.api+json'
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

  const fetchPostOptions = mungOptionsForFetch(jqueryPostOptions, this.JSONAPIAdapter);
  assert.deepEqual(fetchPostOptions, {
    credentials: 'same-origin',
    url: 'https://emberjs.com',
    method: 'POST',
    type: 'POST',
    headers: {
      'custom-header' : 'foo',
      'Content-Type': 'application/vnd.api+json'
    },
    body: {
      a: 1
    },
    data: {
      a: 1
    },
  }, 'POST call\'s options are correct');
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
  assert.deepEqual(options.headers, {
    'Content-Type': 'application/json; charset=utf-8'
  }, 'POST call\'s options are correct');

  options = mungOptionsForFetch(optionsHeadersWithoutContentType, this.basicAdapter);
  assert.deepEqual(options.headers, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-foo': 'bar'
  }, 'POST call\'s options are correct');
});

test('mungOptionsForFetch respects the "Content-Type" if present', function(assert) {
  assert.expect(1);
  const optionsHeadersWithContentType = {
    url: 'https://emberjs.com',
    type: 'POST',
    headers: {
      'Content-Type': 'application/special-type',
    },
    data: { a: 1 }
  };

  let options = mungOptionsForFetch(optionsHeadersWithContentType, this.basicAdapter);
  assert.deepEqual(options.headers, {
    'Content-Type': 'application/special-type',
  }, 'POST call\'s options are correct');
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

  let options = mungOptionsForFetch(optionsHeadersWithoutContentType, this.JSONAPIAdapter);
  assert.deepEqual(options.headers, {
    'Content-Type': 'application/vnd.api+json',
    'X-foo': 'bar',
    'custom-header' : 'foo',
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
