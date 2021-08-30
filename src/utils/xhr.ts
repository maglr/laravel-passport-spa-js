// polyfill bar minimum fetch module
import fetch from 'unfetch';

/**
 * Fetch the given url with given options. Add the `"Content-type": "application/json"` header.
 * @param url
 * @param options
 */
export const getJSON = async (url: string, options: any): Promise<any> => {
  // create option with headers key
  const opt = {
    headers: {},
    ...options,
  };

  // set the headers' content-type
  opt.headers['Content-type'] = 'application/json';

  // run fetch
  const response = await fetch(url, opt);
  const { error, error_description, ...success } = await response.json();

  // error
  if (!response.ok) {
    const errorMessage = error_description || `HTTP error. Unable to fetch ${url}`;
    const e = new Error(errorMessage) as any;
    e.error = error || 'request_error';
    e.error_description = errorMessage;
    throw e;
  }

  return success;
};

/**
 * Cleans the given url
 * @param url
 */
export const cleanUrl = (url: string): string => {
  let cleanUrl = url.replace(/([^:]\/)\/+/g, '$1');

  // Backwards compatiblility/legacy
  if (!cleanUrl.startsWith('http')) {
    cleanUrl = `https://${cleanUrl}`;
  }

  const urlObj = new URL(cleanUrl);
  let urlString = urlObj.toString();

  // Remove tailing slash since toString() returns that when no path is given.
  if (urlString.endsWith('/')) {
    urlString = urlString.substr(0, urlString.length - 1);
  }

  return urlString;
};
