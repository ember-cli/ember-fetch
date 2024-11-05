import { waitForPromise } from '@ember/test-waiters';

const originalFetch = globalThis.fetch;

export function fetch(...args) {
  let promise = originalFetch(...args);

  waitForPromise(promise);

  return promise;
}

export default fetch;
