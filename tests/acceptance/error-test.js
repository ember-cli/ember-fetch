import { module, test } from 'qunit';
import Pretender from 'pretender';
import { later } from '@ember/runloop'
import fetch, {AbortController} from 'fetch';
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

module('Acceptance: Errors', function(hooks) {
  var server;

  hooks.beforeEach(function() {
    server = new Pretender();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  test('isSuccess', async function(assert) {
    server.get('/success', function() {
      return [
        200,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'success' })
      ];
    });

    const response = await fetch('/success')

    assert.ok(isSuccess(response))
  });

  test('isFetchError', async function(assert) {
    server.get('/fetch-error', function() {
      return [
        999,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'fetch-error' })
      ];
    });

    const response = await fetch('/fetch-error')

    assert.ok(isFetchError(response))
  });

  test('isInvalidError', async function(assert) {
    server.get('/invalid-error', function() {
      return [
        422,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'invalid-error' })
      ];
    });

    const response = await fetch('/invalid-error')

    assert.ok(isInvalidError(response))
  });

  test('isUnauthorizedError', async function(assert) {
    server.get('/unauthorized-error', function() {
      return [
        401,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'unauthorized-error' })
      ];
    });

    const response = await fetch('/unauthorized-error')

    assert.ok(isUnauthorizedError(response))
  });

  test('isForbiddenError', async function(assert) {
    server.get('/forbidden-error', function() {
      return [
        403,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'forbidden-error' })
      ];
    });

    const response = await fetch('/forbidden-error')

    assert.ok(isForbiddenError(response))
  });

  test('isNotFoundError', async function(assert) {
    server.get('/not-found-error', function() {
      return [
        404,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'not-found-error' })
      ];
    });

    const response = await fetch('/not-found-error')

    assert.ok(isNotFoundError(response))
  });

  test('isGoneError', async function(assert) {
    server.get('/gone-error', function() {
      return [
        410,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'gone-error' })
      ];
    });

    const response = await fetch('/gone-error')

    assert.ok(isGoneError(response))
  });

  test('isBadRequestError', async function(assert) {
    server.get('/bad-request-error', function() {
      return [
        400,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'bad-request-error' })
      ];
    });

    const response = await fetch('/bad-request-error')

    assert.ok(isBadRequestError(response))
  });

  test('isServerError', async function(assert) {
    server.get('/server-error', function() {
      return [
        555,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'server-error' })
      ];
    });

    const response = await fetch('/server-error')

    assert.ok(isServerError(response))
  });

  test('isAbortError', async function(assert) {
    server.get('/abort-error', function() {
      return [
        200,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'abort-error' })
      ];
    }, 2000);

    const controller = new AbortController();
    const signal = controller.signal;

    later(controller, 'abort', 500);

    const response = await fetch('/abort-error', {signal})

    assert.ok(isAbortError(response))
  });

  test('isConflictError', async function(assert) {
    server.get('/conflict-error', function() {
      return [
        409,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'conflict-error' })
      ];
    });

    const response = await fetch('/conflict-error')

    assert.ok(isConflictError(response))
  });
});
