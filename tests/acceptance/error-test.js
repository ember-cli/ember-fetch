import { module, test } from 'qunit';
import Pretender from 'pretender';
import fetch, { AbortController } from 'fetch';
import {
  isUnauthorizedResponse,
  isForbiddenResponse,
  isNotFoundResponse,
  isGoneResponse,
  isInvalidResponse,
  isBadRequestResponse,
  isServerErrorResponse,
  isAbortError,
  isConflictResponse,
} from 'ember-fetch/errors';

module('Acceptance: Errors', function (hooks) {
  var server;

  hooks.beforeEach(function () {
    server = new Pretender();
  });

  hooks.afterEach(function () {
    server.shutdown();
  });

  test('isInvalidResponse', async function (assert) {
    server.get('/invalid-response', function () {
      return [
        422,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'invalid-response' }),
      ];
    });

    const response = await fetch('/invalid-response');

    assert.ok(isInvalidResponse(response));
  });

  test('isUnauthorizedResponse', async function (assert) {
    server.get('/unauthorized-response', function () {
      return [
        401,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'unauthorized-response' }),
      ];
    });

    const response = await fetch('/unauthorized-response');

    assert.ok(isUnauthorizedResponse(response));
  });

  test('isForbiddenResponse', async function (assert) {
    server.get('/forbidden-response', function () {
      return [
        403,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'forbidden-response' }),
      ];
    });

    const response = await fetch('/forbidden-response');

    assert.ok(isForbiddenResponse(response));
  });

  test('isNotFoundResponse', async function (assert) {
    server.get('/not-found-response', function () {
      return [
        404,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'not-found-response' }),
      ];
    });

    const response = await fetch('/not-found-response');

    assert.ok(isNotFoundResponse(response));
  });

  test('isGoneResponse', async function (assert) {
    server.get('/gone-response', function () {
      return [
        410,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'gone-response' }),
      ];
    });

    const response = await fetch('/gone-response');

    assert.ok(isGoneResponse(response));
  });

  test('isBadRequestResponse', async function (assert) {
    server.get('/bad-request-response', function () {
      return [
        400,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'bad-request-response' }),
      ];
    });

    const response = await fetch('/bad-request-response');

    assert.ok(isBadRequestResponse(response));
  });

  test('isServerErrorResponse', async function (assert) {
    server.get('/server-error-response', function () {
      return [
        555,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'server-error-response' }),
      ];
    });

    const response = await fetch('/server-error-response');

    assert.ok(isServerErrorResponse(response));
  });

  test('isAbortError', async function (assert) {
    server.get(
      '/abort-error',
      function () {
        return [
          200,
          { 'Content-Type': 'text/json' },
          JSON.stringify({ name: 'abort-error' }),
        ];
      },
      2000
    );

    const controller = new AbortController();
    const signal = controller.signal;

    controller.abort();

    assert.rejects(fetch('/abort-error', { signal }), function (error) {
      return isAbortError(error);
    });
  });

  test('isConflictResponse', async function (assert) {
    server.get('/conflict-response', function () {
      return [
        409,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'conflict-response' }),
      ];
    });

    const response = await fetch('/conflict-response');

    assert.ok(isConflictResponse(response));
  });
});
