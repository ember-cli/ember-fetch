import { module, test } from 'qunit';

import {
  isFetchError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isGoneError,
  isInvalidError,
  isBadRequestError,
  isServerError,
  isSuccess,
  isAbortError,
  isConflictError
} from 'ember-fetch/errors';

module('Errors', function() {
  test('isUnauthorizedError', function(assert) {
    assert.ok(isUnauthorizedError({ ok: false, status: 401 }));
  });

  test('isForbiddenError', function(assert) {
    assert.ok(isForbiddenError({ ok: false, status: 403 }));
  });

  test('isNotFoundError', function(assert) {
    assert.ok(isNotFoundError({ ok: false, status: 404 }));
    assert.notOk(isNotFoundError({ ok: false, status: 400 }));
  });

  test('isGoneError', function(assert) {
    assert.ok(isGoneError({ ok: false, status: 410 }));
    assert.notOk(isGoneError({ ok: false, status: 400 }));
  });

  test('isInvalidError', function(assert) {
    assert.ok(isInvalidError({ ok: false, status: 422 }));
  });

  test('isBadRequestError', function(assert) {
    assert.ok(isBadRequestError({ ok: false, status: 400 }));
  });

  test('isServerError', function(assert) {
    assert.notOk(isServerError({ ok: false, status: 499 }));
    assert.ok(isServerError({ ok: false, status: 500 }));
    assert.ok(isServerError({ ok: false, status: 599 }));
    assert.notOk(isServerError({ ok: false, status: 600 }));
  });

  test('isFetchError', function(assert) {
    assert.ok(isFetchError({ ok: false }));
    assert.notOk(isFetchError({ ok: true }));
  });

  test('isAbortError', function(assert) {
    assert.ok(isAbortError({ ok: false, status: 0 }));
  });

  test('isConflictError', function(assert) {
    assert.ok(isConflictError({ ok: false, status: 409 }));
  });

  test('isSuccess', function(assert) {
    assert.notOk(isSuccess({ ok: false, status: 100 }));
    assert.notOk(isSuccess({ ok: false, status: 199 }));
    assert.ok(isSuccess({ ok: false, status: 200 }));
    assert.ok(isSuccess({ ok: false, status: 299 }));
    assert.notOk(isSuccess({ ok: false, status: 300 }));
    assert.ok(isSuccess({ ok: false, status: 304 }));
    assert.notOk(isSuccess({ ok: false, status: 400 }));
    assert.notOk(isSuccess({ ok: false, status: 500 }));
  });
});
