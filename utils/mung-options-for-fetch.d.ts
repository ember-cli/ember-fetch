import { FetchOptions, AjaxOptions } from 'ember-fetch/types';
/**
 * Helper function that translates the options passed to `jQuery.ajax` into a format that `fetch` expects.
 */
export default function mungOptionsForFetch(options: AjaxOptions): FetchOptions;
