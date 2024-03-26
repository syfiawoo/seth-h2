import type {Locale} from './type';

export function getLocaleFromRequest(request: Request): Locale {
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
