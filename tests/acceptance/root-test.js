import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click, find, currentRouteName } from '@ember/test-helpers';
import Pretender from 'pretender';
import fetch from 'fetch';

var server;

module('Acceptance: Root', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server = new Pretender();
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  test('visiting /', async function(assert) {
    server.get('/omg.json', function() {
      return [
        200,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'World' })
      ];
    });

    await visit('/');

    assert.equal(currentRouteName(), 'index');
    assert.equal(this.element.querySelector('.fetch').textContent.trim(), 'Hello World! fetch');
  });

  test('posting a string', function(assert) {
    server.post('/upload', function(req) {
      assert.equal(req.requestBody, 'foo');
      return [
        200,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'World' })
      ];
    });

    return fetch('/upload', {
      method: 'post',
      body: 'foo'
    }).then(function (res) {
      assert.equal(res.status, 200);
      return res.json();
    }).then(function (data) {
      assert.equal(data.name, 'World');
    });
  });

  test('posting a form', function(assert) {
    server.post('/upload', function(req) {
      assert.ok(req.requestBody instanceof window.FormData);
      return [
        200,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'World' })
      ];
    });
    let form = new window.FormData();
    form.append('foo', 'bar');

    return fetch('/upload', {
      method: 'post',
      body: form
    }).then(function (res) {
      assert.equal(res.status, 200);
      return res.json();
    }).then(function (data) {
      assert.equal(data.name, 'World');
    });
  });

  test('posting an array buffer', function(assert) {
    server.post('/upload', function(req) {
      assert.ok(req.requestBody instanceof window.ArrayBuffer);
      return [
        200,
        { 'Content-Type': 'text/json' },
        JSON.stringify({ name: 'World' })
      ];
    });

    return fetch('/upload', {
      method: 'post',
      body: new window.ArrayBuffer()
    }).then(function(res) {
      assert.equal(res.status, 200);
      return res.json();
    }).then(function(data) {
      assert.equal(data.name, 'World');
    });
  });

  test('tests await for fetch requests resolve', async function(assert) {
    server.get('/omg.json', function() {
      return [
        200,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'World' })
      ];
    });

    server.get('/slow-data.json', function() {
      return [
        200,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ content: 'This was slow' })
      ];
    }, 800);

    await visit('/');

    await click('#fetch-slow-data-button');

    assert.ok(find('.fetched-slow-data-span'), 'Test has waited for data to appear');
  });

  test('tests await for fetch requests reject', async function(assert) {
    server.get('/omg.json', function() {
      return [
        200,
        { 'Content-Type': 'text/json'},
        JSON.stringify({ name: 'World' })
      ];
    });

    await visit('/');

    server.shutdown();
    await click('#fetch-broken-data-button');

    assert.ok(find('.fetched-failed-span'), 'The fetch promise has rejected');
  });
});
