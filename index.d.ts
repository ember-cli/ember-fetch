// Type definitions for ember-fetch
// Project: https://github.com/ember-cli/ember-fetch
// Definitions by: Toran Billups <https://github.com/toranb>, Thomas Wang<https://github.com/xg-wang>
/// <reference lib="es2015" />
/// <reference lib="dom" />

import RSVP from 'rsvp';
export default function fetch(
  input: URL | RequestInfo,
  init?: RequestInit
): RSVP.Promise<Response>;
export const Headers: {
  prototype: Headers;
  new (init?: HeadersInit): Headers;
};
export const Request: {
  prototype: Request;
  new (input: RequestInfo, init?: RequestInit): Request;
};
export const Response: {
  prototype: Response;
  new (body?: BodyInit | null, init?: ResponseInit): Response;
  error(): Response;
  redirect(url: string, status?: number): Response;
};
export const AbortController: {
  prototype: AbortController;
  new (): AbortController;
};
