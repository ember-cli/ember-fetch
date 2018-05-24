// Type definitions for Ember Fetch
// Project: https://github.com/ember-cli/ember-fetch
// Definitions by: Toran Billups <https://github.com/toranb>
// TypeScript Version: 2.3

declare module 'fetch' {
  import RSVP from 'rsvp';
  export default function fetch(input: RequestInfo, init?: RequestInit): RSVP.Promise<Response>;
}
