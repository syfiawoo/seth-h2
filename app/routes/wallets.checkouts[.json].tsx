import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

const config = {
  cacheControl: 'public, max-age=3600, stale-while-revalidate=86400', // Set to the amount of time you want to cache the page, in seconds
  removeNoIndex: true, // Set to false if you want to respect robots noindex tags
  updateCanonical: true, // Set to false if you want to respect canonical meta tags
  ignoreRedirects: true, // Set to false if you aren't redirecting to Hydrogen in your theme
};

export async function action({request, context}: LoaderFunctionArgs) {
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
    {
      cacheControl: config.cacheControl,
    },
  );

  const {origin, pathname, search} = new URL(request.url);

  const customHeaders = new Headers({
    'X-Shopify-Client-IP': request.headers.get('X-Shopify-Client-IP') || '',
    'X-Shopify-Client-IP-Sig':
      request.headers.get('X-Shopify-Client-IP-Sig') || '',
    'User-Agent': 'Hydrogen',
    Cookie: request.headers.get('Cookie') || '',
  });

  const body = await request.json();
//   console.log('url', JSON.stringify(body.checkout));
  const response = await fetch(url + pathname + search, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();

  //   const processedData = data
  //     .replace(
  //       /<meta.*name="robots".*content="noindex.*".*>|<link.*rel="canonical".*href=".*".*>|("monorailRegion":"shop_domain")|<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  //       (match) => {
  //         if (match.startsWith('<meta') && config.removeNoIndex) return '';
  //         if (match.startsWith('<link') && config.updateCanonical)
  //           return match.replace(url, origin);
  //         if (match.startsWith('"monorailRegion"'))
  //           return '"monorailRegion":"global"';
  //         if (match.startsWith('<script') && config.ignoreRedirects)
  //           return match.replace(/window\.location\.replace\([^)]*\);?/g, '');
  //         return match;
  //       },
  //     )
  //     .replace(new RegExp(url, 'g'), origin);

  //   const status = /<title>(.|\n)*404 Not Found(.|\n)*<\/title>/i.test(data)
  //     ? 404
  //     : response.status;

//   const headers = new Headers(response.headers);
//   headers.set('Cache-Control', config.cacheControl);
//   console.log('processedData', response.headers.get('set-cookie'));

  //   return new Response(data, {status: 201, headers});

  return redirect(`${data.checkout.web_url}`, {
    headers: {
      'Set-Cookie': response.headers.get('set-cookie') || '',
    },
  });
}
