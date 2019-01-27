import Mix from '@ember/polyfills/types';

export type Nullable<T> = T | null | undefined;

export interface PlainObject {
  [key: string]: string | PlainObject | PlainObject[];
}

export interface PlainHeaders {
  [key: string]: string | undefined | null;
}

export type Method =
  | 'HEAD'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS';

export type AjaxOptions = {
  url: string;
  type: Method;
  data?: PlainObject | BodyInit;
  headers?: PlainHeaders;
};

export type FetchOptions = Mix<
  AjaxOptions,
  { body?: BodyInit | null; method?: Method }
>;

export function isPlainObject(obj: any): obj is PlainObject {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
