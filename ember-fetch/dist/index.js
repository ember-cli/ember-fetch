import { waitForPromise } from '@ember/test-waiters';
import { macroCondition, isTesting } from '@embroider/macros';
import { assert } from '@ember/debug';

let setupFetchWaiter;
debugger;
if (macroCondition(isTesting())) {
  let isSetup = false;
  setupFetchWaiter = () => {
    assert('Do not call setupFetchWaiter more than once, its not needed', !isSetup);
    let realFetch = globalThis.fetch;
    globalThis.fetch = (...args) => waitForPromise(realFetch(...args));
    isSetup = true;
  };
} else {
  // do nothing if we're not testing.
  setupFetchWaiter = () => {};
}

export { setupFetchWaiter };
//# sourceMappingURL=index.js.map
