import { module, test } from 'qunit';

module('Headers', function () {
  test('iterator', function (assert) {
    let headers = new Headers();

    assert.ok(headers[Symbol.iterator]);
    assert.ok(headers.values()[Symbol.iterator]);
    assert.ok(headers.keys()[Symbol.iterator]);
    assert.ok(headers.entries()[Symbol.iterator]);
  });
});
