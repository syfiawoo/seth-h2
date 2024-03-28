import {createCookie} from '@shopify/remix-oxygen';
import type {AppSession} from './session';
import type {Locale} from './type';

const localeCookie = createCookie('locale', {
  // These are defaults for this cookie.
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  domain: 'headlesseth.net',
});

export async function getLocaleFromRequest(
  request: Request,
  session: AppSession,
): Promise<Locale> {
  // Get the user request URL
  const url = new URL(request.url);

  // Match the URL host
  switch (url.host) {
    case 'www.headlesseth.net':
      return {
        language: 'EN',
        country: 'US',
      };
      break;
    case 'fr.headlesseth.net':
      const headers = new Headers();
      const cookieHeader = headers.get('Cookie');
      const cookie = (await localeCookie.parse(cookieHeader)) || {};
      //   session.set('locale', 'FR');
      cookie.locale = 'FR';
      headers.set('Set-Cookie', await localeCookie.serialize(cookie));
      return {
        language: 'FR',
        country: 'CA',
      };
      break;
    default:
      return {
        language: 'EN',
        country: 'CA',
      };
  }
}
