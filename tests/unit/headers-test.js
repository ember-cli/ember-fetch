import { module, test } from 'qunit';
import { Headers } from 'ember-etch';
import { Headers as LegacyImportHeaders } from 'fetch';

module('Headers', function() {
  test('iterator', function(assert) {
    let headers = new Headers();

    assert.ok(headers[Symbol.iterator]);
    assert.ok(headers.values()[Symbol.iterator]);
    assert.ok(headers.keys()[Symbol.iterator]);
    assert.ok(headers.entries()[Symbol.iterator]);
  });

  test('iterator from legacy import', function(assert) {
    let headers = new LegacyImportHeaders();

    assert.ok(headers[Symbol.iterator]);
    assert.ok(headers.values()[Symbol.iterator]);
    assert.ok(headers.keys()[Symbol.iterator]);
    assert.ok(headers.entries()[Symbol.iterator]);
  });
});
