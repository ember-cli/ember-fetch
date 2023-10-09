import { macroCondition, isTesting } from '@embroider/macros';
import { assert } from '@ember/debug';
import { waitForPromise } from '@ember/test-waiters';
import {
  isUnauthorizedResponse,
  isForbiddenResponse,
  isInvalidResponse,
  isBadRequestResponse,
  isNotFoundResponse,
  isGoneResponse,
  isAbortError,
  isConflictResponse,
  isServerErrorResponse,
} from './errors';

let setupFetchWaiter;
let fetch = globalThis.fetch;

if (macroCondition(isTesting())) {
  let isSetup = false;
  setupFetchWaiter = () => {
    assert(
      'Do not call setupFetchWaiter more than once, its not needed',
      !isSetup,
    );

    globalThis.fetch = (...args) => waitForPromise(fetch(...args));

    isSetup = true;
  };
} else {
  // do nothing if we're not testing.
  setupFetchWaiter = () => {};
}

export {
  setupFetchWaiter,
  fetch, // fetch is re-exported here for backwards compatbiility
  isUnauthorizedResponse,
  isForbiddenResponse,
  isInvalidResponse,
  isBadRequestResponse,
  isNotFoundResponse,
  isGoneResponse,
  isAbortError,
  isConflictResponse,
  isServerErrorResponse,
};
