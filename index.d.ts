// Type definitions for Ember Fetch
// Project: https://github.com/ember-cli/ember-fetch
// Definitions by: Toran Billups <https://github.com/toranb>
// TypeScript Version: 2.3

export = fetch;

declare namespace fetch {
  export default function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
