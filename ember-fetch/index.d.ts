// Type definitions for ember-fetch
// Project: https://github.com/ember-cli/ember-fetch
// Definitions by: Stephan Hug <https://github.com/stephanh90>
/// <reference lib="es2017" />
/// <reference lib="dom" />

export default function isUnauthorizedResponse(response: Response): booelan;
export default function isForbiddenResponse(response: Response): booelan;
export default function isInvalidResponse(response: Response): boolean;
export default function isBadRequestResponse(response: Response): boolean;
export default function isNotFoundResponse(response: Response): boolean;
export default function isGoneResponse(response: Response): boolean;
export default function isAbortError(error: DOMException): boolean;
export default function isConflictResponse(response: Response): boolean;
export default function isServerErrorResponse(response: Response): boolean;

export default function fetch(
  input: URL | RequestInfo,
  init?: RequestInit
): RSVP.Promise<Response>;

export default function setupFetchWaiter(): void;
