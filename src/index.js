import { waitForPromise } from '@ember/test-waiters';

export function fetch(...args) {
  let promise = globalThis.fetch(...args);

  waitForPromise(promise);

  return promise;
}

export default fetch;
