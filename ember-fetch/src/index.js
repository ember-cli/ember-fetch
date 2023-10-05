import { macroCondition, isTesting } from '@embroider/macros';
import { assert } from '@ember/debug';
import { waitForPromise } from '@ember/test-waiters';

let setupFetchWaiter;
let fetch;

if (macroCondition(isTesting())) {
  let isSetup = false;
  setupFetchWaiter = () => {
    assert(
      'Do not call setupFetchWaiter more than once, its not needed',
      !isSetup,
    );

    let fetch = globalThis.fetch;
    globalThis.fetch = (...args) => waitForPromise(fetch(...args));

    isSetup = true;
  };
} else {
  // do nothing if we're not testing.
  setupFetchWaiter = () => {};
}

// fetch is re-exported here for backwards compatbiility
export { setupFetchWaiter, fetch };
