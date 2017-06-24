import Ember from 'ember';
import $ from 'jquery';
import {
  module,
  test
} from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';
import Pretender from 'pretender';
import fetch from 'fetch';
var application;
var server;

module('Acceptance: Root', {
  beforeEach: function() {
    server = new Pretender();
    application = startApp();
  },

  afterEach: function() {
    server.shutdown();
    Ember.run(application, 'destroy');
  }
});

test('visiting /', function(assert) {
  server.get('/omg.json', function() {
    return [
      200,
      { 'Content-Type': 'text/json'},
      JSON.stringify({ name: 'World' })
    ];
  });

  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
    assert.equal($.trim($('.fetch').text()), 'Hello World! fetch');
    assert.equal($.trim($('.ajax').text()), 'Hello World! ajax');
  });
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
  var form = new window.FormData();
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

test('tests await for fetch requests', function(assert) {
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

  visit('/');


  andThen(function() {
    click('#fetch-slow-data-button');
  });

  andThen(function() {
    assert.equal(find('.fetched-slow-data-span').length, 1, 'Test has waited for data to appear');
  });
});

test('tests await for fetch requests', function(assert) {
  server.get('/omg.json', function() {
    return [
      200,
      { 'Content-Type': 'text/json'},
      JSON.stringify({ name: 'World' })
    ];
  });

  visit('/');


  andThen(function() {
    click('#fetch-slow-data-button');
  });

  andThen(function() {
    assert.equal(find('.fetched-slow-data-failed-span').length, 1, 'The fetch promise has rejected');
  });
});
