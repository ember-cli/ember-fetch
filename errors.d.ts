/**
 * Checks if the given response represents an unauthorized request error
 */
export declare function isUnauthorizedResponse(response: Response): boolean;
/**
 * Checks if the given response represents a forbidden request error
 */
export declare function isForbiddenResponse(response: Response): boolean;
/**
 * Checks if the given response represents an invalid request error
 */
export declare function isInvalidResponse(response: Response): boolean;
/**
 * Checks if the given response represents a bad request error
 */
export declare function isBadRequestResponse(response: Response): boolean;
/**
 * Checks if the given response represents a "not found" error
 */
export declare function isNotFoundResponse(response: Response): boolean;
/**
 * Checks if the given response represents a "gone" error
 */
export declare function isGoneResponse(response: Response): boolean;
/**
 * Checks if the given error is an "abort" error
 */
export declare function isAbortError(error: DOMException): boolean;
/**
 * Checks if the given response represents a conflict error
 */
export declare function isConflictResponse(response: Response): boolean;
/**
 * Checks if the given response represents a server error
 */
export declare function isServerErrorResponse(response: Response): boolean;
