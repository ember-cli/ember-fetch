import { module, test } from 'qunit';
import { Response } from 'fetch';

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

module('Errors', function () {
  test('isUnauthorizedResponse', function (assert) {
    assert.ok(isUnauthorizedResponse(new Response(null, { status: 401 })));
  });

  test('isForbiddenResponse', function (assert) {
    assert.ok(isForbiddenResponse(new Response(null, { status: 403 })));
  });

  test('isNotFoundResponse', function (assert) {
    assert.ok(isNotFoundResponse(new Response(null, { status: 404 })));
    assert.notOk(isNotFoundResponse(new Response(null, { status: 400 })));
  });

  test('isGoneResponse', function (assert) {
    assert.ok(isGoneResponse(new Response(null, { status: 410 })));
    assert.notOk(isGoneResponse(new Response(null, { status: 400 })));
  });

  test('isInvalidResponse', function (assert) {
    assert.ok(isInvalidResponse(new Response(null, { status: 422 })));
  });

  test('isBadRequestResponse', function (assert) {
    assert.ok(isBadRequestResponse(new Response(null, { status: 400 })));
  });

  test('isServerErrorResponse', function (assert) {
    assert.notOk(isServerErrorResponse(new Response(null, { status: 499 })));
    assert.ok(isServerErrorResponse(new Response(null, { status: 500 })));
    assert.ok(isServerErrorResponse(new Response(null, { status: 599 })));
  });

  test('isAbortError', function (assert) {
    assert.ok(isAbortError(new DOMException('AbortError', 'AbortError')));
  });

  test('isConflictResponse', function (assert) {
    assert.ok(isConflictResponse(new Response(null, { status: 409 })));
  });
});
