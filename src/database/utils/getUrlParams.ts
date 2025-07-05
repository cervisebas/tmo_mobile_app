import qs from 'qs';

export function getUrlParams<T extends Record<string, any>>(url: string): T {
  const oURL = new URL(url);
  const params = qs.parse(oURL.search.slice(1));
  
  return params as T;
}