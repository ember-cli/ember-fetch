import { module, test } from 'qunit';
import { serializeQueryParams } from 'ember-fetch/utils/serialize-query-params';

module('Unit | serializeQueryParams', function () {
  test('serializeQueryParams turns deeply nested objects into queryParams like $.param', function (assert) {
    assert.expect(1);

    const body = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: 4,
        },
        g: [5, 6, 7],
      },
    };
    const queryParamString = serializeQueryParams(body);

    assert.strictEqual(
      queryParamString,
      'a=1&b=2&c%5Bd%5D=3&c%5Be%5D%5Bf%5D=4&c%5Bg%5D%5B%5D=5&c%5Bg%5D%5B%5D=6&c%5Bg%5D%5B%5D=7'
    );
  });

  test('serializeQueryParams does not serialize keys with undefined values', function (assert) {
    assert.expect(1);

    const body = {
      a: undefined,
      b: 2,
      c: {
        d: undefined,
        e: {
          f: 4,
        },
        g: [5, 6, 7],
      },
      h: null,
      i: 0,
      j: false,
    };
    const queryParamString = serializeQueryParams(body);

    assert.strictEqual(
      queryParamString,
      'b=2&c%5Be%5D%5Bf%5D=4&c%5Bg%5D%5B%5D=5&c%5Bg%5D%5B%5D=6&c%5Bg%5D%5B%5D=7&h=&i=0&j=false'
    );
  });
});
