import Ember from 'ember';
import DS from 'ember-data';
import { module, test } from 'qunit';
import {
  Headers,
  Response
} from 'fetch';
import AdapterFetchMixin, {
  mungOptionsForFetch,
  headersToObject,
  serialiazeQueryParams,
  determineBodyPromise
} from 'ember-fetch/mixins/adapter-fetch';

const { JSONAPIAdapter } = DS;

module('Unit | Mixin | adapter-fetch', {
  beforeEach() {
    this.JSONAPIAdapter = JSONAPIAdapter.extend(AdapterFetchMixin, {
      headers: {
        'custom-header' : 'foo',
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
      'Content-Type': 'application/json; charset=utf-8'
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
  }, 'POST call\'s options without a headers object now has a headers object which has a content-type header');

  options = mungOptionsForFetch(optionsHeadersWithoutContentType, this.basicAdapter);
  assert.deepEqual(options.headers, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-foo': 'bar'
  }, 'POST call\'s options with a headers object now has a content-type header');
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
  assert.deepEqual(options.headers, {
    foo: 'bar',
  }, 'GET call\'s options has no added content-type header');
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
  assert.deepEqual(options.headers, {
    foo: 'bar',
  }, 'POST call with no body has no added content-type header');
});

test('mungOptionsForFetch respects the "Content-Type" header if present', function(assert) {
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
  }, 'POST call\'s options has the original content-type header');
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
    'Content-Type': 'application/json; charset=utf-8',
    'X-foo': 'bar',
    'custom-header' : 'foo',
  }, 'POST call\'s options are correct');
});

test('mungOptionsForFetch sets the method to "GET" if `type` is not provided', function(assert) {
  assert.expect(1);
  const getOptions = {
    url: 'https://emberjs.com',
    type: undefined,
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
  assert.equal(options.url, `${baseUrl}?a=1&b=2`, 'url that started without query params has query params');

  const hasQueryStringOptions = {
    url: `${baseUrl}?fastboot=true`,
    data: { a: 1, b: 2 }
  };

  options = mungOptionsForFetch(hasQueryStringOptions, this.basicAdapter);
  assert.equal(options.url, `${baseUrl}?fastboot=true&a=1&b=2`, 'url that started with query params has more query params');
});

test('headersToObject turns an Headers instance into an object', function (assert) {
  assert.expect(1);

  const exampleHeaders = { etag: 'abc123' };
  const headers = new Headers(exampleHeaders);
  const headerObject = headersToObject(headers);

  assert.deepEqual(headerObject, exampleHeaders);
});

test('headersToObject returns an empty object if no headers are passed to it', function (assert) {
  assert.expect(1);

  const headerObject = headersToObject();
  assert.deepEqual(headerObject, {});
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

test('determineBodyResponse returns the body when it is present', function(assert) {
  assert.expect(1);

  const response = new Response('{"data": "foo"}', {status: 200});
  const bodyPromise = determineBodyPromise(response, {});

  return bodyPromise.then((body) => {
    assert.deepEqual(body, {data: 'foo'});
  });
});

test('determineBodyResponse returns an empty object when the http status code is 204', function(assert) {
  assert.expect(1);

  const response = new Response(null, {status: 204});
  const bodyPromise = determineBodyPromise(response, {});

  return bodyPromise.then((body) => {
    assert.deepEqual(body, {data: null});
  });
});

test('determineBodyResponse returns an empty object when the http status code is 205', function(assert) {
  assert.expect(1);

  const response = new Response(null, {status: 205});
  const bodyPromise = determineBodyPromise(response, {});

  return bodyPromise.then((body) => {
    assert.deepEqual(body, {data: null});
  });
});

test('determineBodyResponse returns an empty object when the request method is \'HEAD\'', function(assert) {
  assert.expect(1);

  const response = new Response(null, {status: 200});
  const bodyPromise = determineBodyPromise(response, {method: 'HEAD'});

  return bodyPromise.then((body) => {
    assert.deepEqual(body, {data: null});
  });
});

test('default fetch hook is correctly called if not overriden', function(assert) {
  assert.expect(1);

  const fetchReturn = this.JSONAPIAdapter._ajaxRequest({});
  assert.ok(fetchReturn instanceof Ember.RSVP.Promise);
});

test('overridden fetch hook is called when supplied', function(assert) {
  assert.expect(1);

  const newText = 'intercepted';
  this.JSONAPIAdapter._fetchRequest = () => newText;
  const fetchReturn = this.JSONAPIAdapter._ajaxRequest({});
  assert.equal(fetchReturn, newText);
});
