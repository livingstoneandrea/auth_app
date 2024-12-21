import Cookies from 'js-cookie';

export const getCookie = (key: string): string | undefined => Cookies.get(key);

export const setCookie = (key: string, value: string, options: Cookies.CookieAttributes = {}) => {
  Cookies.set(key, value, { expires: 7, ...options });
};

export const removeCookie = (key: string) => Cookies.remove(key);
