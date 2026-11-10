/**
 * @module internal/url
 *
 * URL allowlists shared by the components that render links and media. A URL
 * that isn't allowed is treated as absent.
 *
 * @internal
 */

/** Schemes a link `href` may use. Relative and scheme-less URLs are always allowed. */
const HREF_SCHEMES = new Set(['http', 'https', 'mailto', 'tel', 'sms']);

/** Schemes a media `src` may use (`data:` only for images, checked separately). */
const MEDIA_SCHEMES = new Set(['http', 'https', 'blob']);

/**
 * The URL with control characters and whitespace dropped and lowercased, as
 * browsers ignore them inside a scheme (`java\tscript:`).
 */
function compact(url: string): string {
  // eslint-disable-next-line no-control-regex
  return url.replace(/[\u0000-\u0020\u007f]/g, '').toLowerCase();
}

/** The URL's scheme, or `''` for a relative or scheme-less URL (`/`, `./`, `?`, `#`, `//host`). */
function schemeOf(url: string): string {
  const match = /^([a-z][a-z0-9+.-]*):/.exec(compact(url));
  return match ? match[1]! : '';
}

/** Whether a link `href` is allowed: relative, or http, https, mailto, tel or sms. */
export function isSafeHref(href: string): boolean {
  const scheme = schemeOf(href);
  return scheme === '' || HREF_SCHEMES.has(scheme);
}

/** Whether a media `src` is allowed: relative, http, https, blob, or a `data:image/…` URL. */
export function isSafeMediaSrc(src: string): boolean {
  const scheme = schemeOf(src);
  if (scheme === '' || MEDIA_SCHEMES.has(scheme)) return true;
  return scheme === 'data' && compact(src).startsWith('data:image/');
}

/** The href when it's allowed, otherwise `undefined`. */
export function safeHref(href: string | undefined): string | undefined {
  return href !== undefined && isSafeHref(href) ? href : undefined;
}
