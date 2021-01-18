import Mix from '@ember/polyfills/types';

export type Nullable<T> = T | null | undefined;

export type PlainObject<T = string | number | boolean> = {
  [key: string]: T | PlainObject<T> | PlainObject<T>[] | undefined | null;
}

export type PlainHeaders = {
  [key: string]: string;
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

export type Credentials = 'omit' | 'same-origin' | 'include';

export type FetchOptions = Mix<
  AjaxOptions,
  { body?: BodyInit | null; method?: Method, credentials: Credentials }
>;

export function isPlainObject(obj: any): obj is PlainObject {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
