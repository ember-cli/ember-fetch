/// <reference types="jquery" />
/**
 * Function that always attempts to parse the response as json, and if an error is thrown,
 * returns `undefined` if the response is successful and has a status code of 204 (No Content),
 * or 205 (Reset Content) or if the request method was 'HEAD', and the plain payload otherwise.
 */
export default function determineBodyPromise(response: Response, requestData: JQueryAjaxSettings): Promise<object | string | undefined>;
