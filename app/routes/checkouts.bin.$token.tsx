import {redirect, type LoaderFunctionArgs, json} from '@shopify/remix-oxygen';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {
    shop: {
      primaryDomain: {url},
    },
  } = await context.storefront.query(
    `#graphql
      query {
        shop {
          primaryDomain {
            url
          }
        }
      }
    `,
  );

  const {origin, pathname, search} = new URL(request.url);

  console.log('heeeeeeee');
  return redirect(`${url}${pathname}${search}`, {
    headers: {
      'X-Shopify-Client-IP': request.headers.get('X-Shopify-Client-IP') || '',
      'X-Shopify-Client-IP-Sig':
        request.headers.get('X-Shopify-Client-IP-Sig') || '',
      'User-Agent': 'Hydrogen',
      Cookie: request.headers.get('Cookie') || '',
      'Set-Cookie': request.headers.get('Set-Cookie') || '',
    },
  });
}
