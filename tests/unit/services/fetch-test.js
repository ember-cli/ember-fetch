import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:fetch', 'Unit | Service | fetch', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  beforeEach() {
    this.subject().originalFetch = (...args) => args;
  }
});

test('it forwards a simple fetch request without chaning anything', function(assert) {
  let service = this.subject();
  const url = 'http://example.com';

  assert.deepEqual(service.fetch(url), [url]);
  assert.deepEqual(service.fetch(url, {}), [ url, {} ]);
  assert.deepEqual(service.fetch(url, { foo: 'foo' }), [ url, { foo: 'foo' } ]);
});

test('it adds headers', function(assert) {
  let service = this.subject();
  const url = 'http://example.com';
  service.headers = { foo: 'foo' };

  assert.deepEqual(service.fetch(url), [url, { headers: { foo: 'foo' } }]);
  assert.deepEqual(service.fetch(url, {headers: {bar: 'bar'}}), [url, { headers: { foo: 'foo', bar: 'bar' } }]);
});

test('it adds headers from CP', function(assert) {
  let service = this.subject();
  const url = 'http://example.com';
  service.headers = Ember.computed('foo', function() {
    return {foo: this.get('foo')};
  });

  assert.deepEqual(service.fetch(url, {headers: {bar: 'bar'}}), [url, { headers: { foo: undefined, bar: 'bar' } }]);
  service.set('foo', 'newFoo')
  assert.deepEqual(service.fetch(url, {headers: {bar: 'bar'}}), [url, { headers: { foo: 'newFoo', bar: 'bar' } }]);
});
