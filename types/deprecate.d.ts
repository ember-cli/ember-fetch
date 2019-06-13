// TODO: This file should be removed once https://github.com/emberjs/ember.js/issues/17185 close

// tslint:disable-next-line:strict-export-declare-modifiers
interface DeprecationOptions {
  id: string;
  until: string;
  url?: string;
}

/**
 * Display a deprecation warning with the provided message and a stack trace
 * (Chrome and Firefox only).
 */
export function deprecate(
    message: string,
    test: boolean,
    options: DeprecationOptions
): any;

/**
 * Alias an old, deprecated method with its new counterpart.
 */
export function deprecateFunc<Func extends ((...args: any[]) => any)>(
    message: string,
    options: DeprecationOptions,
    func: Func
): Func;

// Type definitions for non-npm package @ember/debug 3.0
// Project: https://emberjs.com/api/ember/3.4/modules/@ember%2Fdebug
// Definitions by: Mike North <https://github.com/mike-north>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

/**
 * Define an assertion that will throw an exception if the condition is not met.
 */
export function assert(desc: string, test?: boolean): void | never;
/**
 * Display a debug notice.
 */
export function debug(message: string): void;

/**
 * Convenience method to inspect an object. This method will attempt to
 * convert the object into a useful string description.
 */
export function inspect(obj: any): string;
/**
 * Allows for runtime registration of handler functions that override the default deprecation behavior.
 * Deprecations are invoked by calls to [Ember.deprecate](http://emberjs.com/api/classes/Ember.html#method_deprecate).
 * The following example demonstrates its usage by registering a handler that throws an error if the
 * message contains the word "should", otherwise defers to the default handler.
 */
export function registerDeprecationHandler(handler: (message: string, options: { id: string, until: string }, next: () => void) => void): void;
/**
 * Allows for runtime registration of handler functions that override the default warning behavior.
 * Warnings are invoked by calls made to [Ember.warn](http://emberjs.com/api/classes/Ember.html#method_warn).
 * The following example demonstrates its usage by registering a handler that does nothing overriding Ember's
 * default warning behavior.
 */
export function registerWarnHandler(handler: (message: string, options: { id: string }, next: () => void) => void): void;

/**
 * Run a function meant for debugging.
 */
export function runInDebug(func: () => any): void;

/**
 * Display a warning with the provided message.
 */
export function warn(message: string, test: boolean, options: { id: string }): void;
export function warn(message: string, options: { id: string }): void;
/**
 * @deprecated Missing deprecation options: https://emberjs.com/deprecations/v2.x/#toc_ember-debug-function-options
 */
export function warn(message: string, test: boolean, options?: { id?: string }): void;
/**
 * @deprecated Missing deprecation options: https://emberjs.com/deprecations/v2.x/#toc_ember-debug-function-options
 */
export function warn(message: string, options?: { id?: string }): void;
