export function isUnauthorizedResponse(response) {
  return response.status === 401;
}

export function isForbiddenResponse(response) {
  return response.status === 403;
}

export function isInvalidResponse(response) {
  return response.status === 422;
}

export function isBadRequestResponse(response) {
  return response.status === 400;
}

export function isNotFoundResponse(response) {
  return response.status === 404;
}

export function isGoneResponse(response) {
  return response.status === 410;
}

export function isAbortError(error) {
  return error.name == 'AbortError';
}

export function isConflictResponse(response) {
  return response.status === 409;
}

export function isServerErrorResponse(response) {
  return response.status >= 500 && response.status < 600;
}
