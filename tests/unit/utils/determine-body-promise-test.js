import { module, test } from 'qunit';
import { Response } from 'fetch';
import determineBodyPromise from 'ember-fetch/utils/determine-body-promise';

module('Unit | determineBodyPromise', function () {
  test('determineBodyResponse returns the body when it is present', function (assert) {
    assert.expect(1);

    const response = new Response('{"data": "foo"}', { status: 200 });
    const bodyPromise = determineBodyPromise(response, {});

    return bodyPromise.then((body) => {
      assert.deepEqual(body, { data: 'foo' });
    });
  });

  test('determineBodyResponse returns the body even if it is not json', function (assert) {
    assert.expect(1);

    const response = new Response('this is not json', { status: 200 });
    const bodyPromise = determineBodyPromise(response, {});

    return bodyPromise.then((body) => {
      assert.deepEqual(body, 'this is not json');
    });
  });

  test('determineBodyResponse returns undefined when the http status code is 204', function (assert) {
    assert.expect(1);

    const response = new Response(null, { status: 204 });
    const bodyPromise = determineBodyPromise(response, {});

    return bodyPromise.then((body) => {
      assert.deepEqual(body, undefined);
    });
  });

  test('determineBodyResponse returns undefined when the http status code is 205', function (assert) {
    assert.expect(1);

    const response = new Response(null, { status: 205 });
    const bodyPromise = determineBodyPromise(response, {});

    return bodyPromise.then((body) => {
      assert.deepEqual(body, undefined);
    });
  });

  test("determineBodyResponse returns undefined when the request method is 'HEAD'", function (assert) {
    assert.expect(1);

    const response = new Response(null, { status: 200 });
    const bodyPromise = determineBodyPromise(response, { method: 'HEAD' });

    return bodyPromise.then((body) => {
      assert.deepEqual(body, undefined);
    });
  });
});
