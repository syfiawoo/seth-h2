import type {AppSession} from './session';
import type {Locale} from './type';

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
      session.set('locale', 'FR');
      headers.set('Set-Cookie', await session.commit());
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
