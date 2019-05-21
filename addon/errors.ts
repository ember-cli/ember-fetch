/**
 * Checks if the given response is a FetchError
 */
export function isFetchError(response: Response): boolean {
  return response.ok === false
}

/**
 * Checks if the given response represents an unauthorized request error
 */
export function isUnauthorizedError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status === 401;
  }

  return false
}

/**
 * Checks if the given response represents a forbidden request error
 */
export function isForbiddenError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status === 403;
  }

  return false
}

/**
 * Checks if the given response represents an invalid request error
 */
export function isInvalidError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status === 422;
  }

  return false
}

/**
 * Checks if the given response represents a bad request error
 */
export function isBadRequestError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status === 400;
  }

  return false
}

/**
 * Checks if the given response represents a "not found" error
 */
export function isNotFoundError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status === 404;
  }

  return false
}

/**
 * Checks if the given response represents a "gone" error
 */
export function isGoneError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status === 410;
  }

  return false
}

/**
 * Checks if the given response represents an "abort" error
 */
export function isAbortError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status === 0;
  }

  return false
}

/**
 * Checks if the given response represents a conflict error
 */
export function isConflictError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status === 409;
  }

  return false
}

/**
 * Checks if the given response represents a server error
 */
export function isServerError(response: Response): boolean {
  if (isFetchError(response)) {
    return response.status >= 500 && response.status < 600;
  }

  return false
}

/**
 * Checks if the given status code represents a successful request
 */
export function isSuccess(response: Response): boolean {
  const s = response.status
  return (s >= 200 && s < 300) || s === 304;
}
