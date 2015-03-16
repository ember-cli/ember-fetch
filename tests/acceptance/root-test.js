import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';
import Pretender from 'pretender';
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
