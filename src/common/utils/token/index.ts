import { TOKEN } from '@src/common/constants/auth';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

export const setAuthToken = (tokenType: TOKEN, token: string, expiredNumber: number) => {
  Cookies.set(tokenType, token, { expires: expiredNumber });
};

function base64UrlToBase64(base64Url: string) {
  // Convert Base64 URL encoded string to Base64 encoded string
  return base64Url.replace(/-/g, '+').replace(/_/g, '/');
}

function parseJwt(token?: string) {
  try {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token');

      return '';
    }

    // Split token into parts and decode
    const parts = token.split('.');

    if (parts.length !== 3) {
      console.error('Token does not have three parts');

      return '';
    }

    // Base64 URL decode
    const payloadBase64 = base64UrlToBase64(parts[1]);
    const decodedPayload = window.atob(payloadBase64);

    // Parse JSON
    return JSON.parse(decodedPayload);
  } catch (e) {
    console.error('Error parsing token:', e);

    return '';
  }
}

/** Get auth token with provided token type
 * App will decode token to get exp and compare with the current time
 * If expired, remove this token and return null
 * If token invalid, remove token and return null
 * If valid, return the token
 *  */
export const getAuthToken = (tokenType: TOKEN): string | null => {
  const token = Cookies.get(tokenType);
  const { exp } = parseJwt(token);

  if (!token) return null;

  try {
    // const { exp } = JSON.parse(window.atob(token.toString()?.split('.')[1]));
    const isExpired = dayjs().isSameOrAfter(dayjs.unix(exp), 'second');

    if (isExpired) {
      Cookies.remove(tokenType);

      return null;
    }

    return token;
  } catch (e) {
    Cookies.remove(tokenType);

    return null;
  }
};

export const clearAuthToken = () => {
  Cookies.remove(TOKEN.ACCESS_TOKEN);
};
