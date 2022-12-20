import { module, test } from 'qunit';
import { AbortController } from 'ember-fetch';
import { AbortController as LegacyAbortController } from 'ember-fetch';

module('AbortController', function() {
  test('signal', function(assert) {
    assert.expect(1);
    let controller = new AbortController();
    let signal = controller.signal;

    let done = assert.async();
    signal.addEventListener('abort', function() {
      assert.ok(true);
      done();
    });

    controller.abort();
  })

  test('signal works from legacy import', function(assert) {
    assert.expect(1);
    let controller = new LegacyAbortController();
    let signal = controller.signal;

    let done = assert.async();
    signal.addEventListener('abort', function() {
      assert.ok(true);
      done();
    });

    controller.abort();
  })
});
