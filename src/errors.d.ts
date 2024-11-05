/**
 * Checks if the given response represents an unauthorized request error
 */
export function isUnauthorizedResponse(response: Response): boolean;

/**
 * Checks if the given response represents a forbidden request error
 */
export function isForbiddenResponse(response: Response): boolean;

/**
 * Checks if the given response represents an invalid request error
 */
export function isInvalidResponse(response: Response): boolean;

/**
 * Checks if the given response represents a bad request error
 */
export function isBadRequestResponse(response: Response): boolean;

/**
 * Checks if the given response represents a "not found" error
 */
export function isNotFoundResponse(response: Response): boolean;

/**
 * Checks if the given response represents a "gone" error
 */
export function isGoneResponse(response: Response): boolean;

/**
 * Checks if the given error is an "abort" error
 */
export function isAbortError(error: DOMException): boolean;

/**
 * Checks if the given response represents a conflict error
 */
export function isConflictResponse(response: Response): boolean;

/**
 * Checks if the given response represents a server error
 */
export function isServerErrorResponse(response: Response): boolean;
