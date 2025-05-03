import { module, test } from 'qunit';
import mungOptionsForFetch from 'ember-fetch/utils/mung-options-for-fetch';

module('Unit | mungOptionsForFetch', function () {
  test('mungOptionsForFetch transforms jQuery-style options into fetch compatible options', function (assert) {
    assert.expect(2);

    const jQueryGetOptions = {
      url: 'https://emberjs.com',
      type: 'GET',
      headers: {
        'x-fake-header': 13,
        'Content-Type': 'application/vnd.api+json',
      },
      data: {
        a: 1,
        b: 2,
      },
    };

    const fetchGetOptions = mungOptionsForFetch(jQueryGetOptions);

    assert.deepEqual(
      fetchGetOptions,
      {
        credentials: 'same-origin',
        url: 'https://emberjs.com?a=1&b=2',
        method: 'GET',
        type: 'GET',
        headers: {
          'x-fake-header': 13,
          'Content-Type': 'application/vnd.api+json',
        },
        data: {
          a: 1,
          b: 2,
        },
      },
      "GET call's options are correct"
    );

    const jqueryPostOptions = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: { a: 1 },
    };

    const fetchPostOptions = mungOptionsForFetch(jqueryPostOptions);
    assert.deepEqual(
      fetchPostOptions,
      {
        credentials: 'same-origin',
        url: 'https://emberjs.com',
        method: 'POST',
        type: 'POST',
        body: '{"a":1}',
        data: {
          a: 1,
        },
      },
      "POST call's options are correct"
    );
  });

  test('mungOptionsForFetch sets the method to "GET" if `type` is not provided', function (assert) {
    assert.expect(1);
    const getOptions = {
      url: 'https://emberjs.com',
      type: undefined,
    };

    const options = mungOptionsForFetch(getOptions);
    assert.strictEqual(options.method, 'GET');
  });

  test('mungOptionsForFetch sets the method to an uppercase string', function (assert) {
    assert.expect(2);
    const getOptions = {
      url: 'https://emberjs.com',
      type: 'get',
    };

    let options = mungOptionsForFetch(getOptions);
    assert.strictEqual(options.method, 'GET');

    const postOptions = {
      url: 'https://emberjs.com',
      method: 'post',
    };

    options = mungOptionsForFetch(postOptions);
    assert.strictEqual(options.method, 'POST');
  });

  test('mungOptionsForFetch adds string query params to the url correctly', function (assert) {
    assert.expect(2);

    const baseUrl = 'https://emberjs.com';
    const noQueryStringOptions = {
      url: baseUrl,
      data: { a: 1, b: 2 },
    };

    let options = mungOptionsForFetch(noQueryStringOptions);
    assert.strictEqual(
      options.url,
      `${baseUrl}?a=1&b=2`,
      'url that started without query params has query params'
    );

    const hasQueryStringOptions = {
      url: `${baseUrl}?fastboot=true`,
      data: { a: 1, b: 2 },
    };

    options = mungOptionsForFetch(hasQueryStringOptions);
    assert.strictEqual(
      options.url,
      `${baseUrl}?fastboot=true&a=1&b=2`,
      'url that started with query params has more query params'
    );
  });

  test("mungOptionsForFetch removes undefined query params when method is POST and 'data' is an object", function (assert) {
    assert.expect(1);

    const dataAsObject = {
      a: 1,
      b: undefined,
      c: 3,
      d: null,
      e: 0,
      f: false,
    };

    const undefinedQueryStringOptions = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: dataAsObject,
    };

    let options = mungOptionsForFetch(undefinedQueryStringOptions);
    assert.deepEqual(options.body, '{"a":1,"c":3,"d":null,"e":0,"f":false}');
  });

  test('mungOptionsForFetch sets the request body correctly when the method is not GET or HEAD', function (assert) {
    assert.expect(3);

    const baseOptions = {
      url: '/',
      type: 'POST',
      data: { a: 1 },
    };

    // Tests POST method.
    let options = mungOptionsForFetch(baseOptions);
    assert.strictEqual(
      options.body,
      JSON.stringify(baseOptions.data),
      'POST request body correctly set'
    );

    // Tests PUT method.
    baseOptions.type = 'PUT';
    options = mungOptionsForFetch(baseOptions);
    assert.strictEqual(
      options.body,
      JSON.stringify(baseOptions.data),
      'PUT request body correctly set'
    );

    // Tests DELETE method.
    baseOptions.type = 'DELETE';
    options = mungOptionsForFetch(baseOptions);
    assert.strictEqual(
      options.body,
      JSON.stringify(baseOptions.data),
      'DELETE request has the correct body'
    );
  });

  test("mungOptionsForFetch sets the request body correctly when the method is POST and 'data' is a string", function (assert) {
    assert.expect(1);

    // Tests stringified objects.
    const stringifiedData = JSON.stringify({ a: 1, b: 2 });
    const optionsWithStringData = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: stringifiedData,
    };

    let options = mungOptionsForFetch(optionsWithStringData);
    assert.deepEqual(options.body, stringifiedData);
  });

  test('mungOptionsForFetch does not set a request body when the method is GET or HEAD', function (assert) {
    assert.expect(4);

    const baseOptions = {
      url: '/',
      type: 'GET',
      data: { a: 1 },
    };

    let options = mungOptionsForFetch(baseOptions);
    assert.strictEqual(
      options.body,
      undefined,
      'GET request does not have a request body'
    );

    baseOptions.type = 'HEAD';
    options = mungOptionsForFetch(baseOptions);
    assert.strictEqual(
      options.body,
      undefined,
      'HEAD request does not have a request body'
    );

    baseOptions.data = {};
    options = mungOptionsForFetch(baseOptions);
    assert.strictEqual(
      options.body,
      undefined,
      'HEAD request does not have a request body when `data` is an empty object'
    );

    baseOptions.type = 'GET';
    options = mungOptionsForFetch(baseOptions);
    assert.strictEqual(
      options.body,
      undefined,
      'GET request does not have a request body when `data` is an empty object'
    );
  });

  test("mungOptionsForFetch correctly processes an empty 'data' object", function (assert) {
    assert.expect(2);

    const getData = {
      url: 'https://emberjs.com',
      type: 'GET',
      data: {},
    };

    const getOptions = mungOptionsForFetch(getData);
    assert.strictEqual(
      getOptions.url.indexOf('?'),
      -1,
      'A question mark is not added if there are no query params to add'
    );

    const postData = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: {},
    };

    const postOptions = mungOptionsForFetch(postData);
    assert.strictEqual(
      postOptions.body,
      '{}',
      "'options.body' is an empty object"
    );
  });

  test("mungOptionsForFetch sets the request body correctly when 'data' is FormData", function (assert) {
    assert.expect(1);

    const formData = new FormData();
    const postData = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: formData,
    };

    const postOptions = mungOptionsForFetch(postData);
    assert.strictEqual(
      postOptions.body,
      formData,
      "'options.body' is the FormData passed in"
    );
  });

  test("mungOptionsForFetch sets the request body correctly when 'data' has no constructor", function (assert) {
    assert.expect(1);

    const data = Object.create(null);
    data.request = 'body';
    const postData = {
      url: 'https://emberjs.com',
      type: 'POST',
      data: data,
    };

    const postOptions = mungOptionsForFetch(postData);
    assert.strictEqual(
      postOptions.body,
      JSON.stringify(data),
      "'options.body' is properly converted to a string"
    );
  });
});
