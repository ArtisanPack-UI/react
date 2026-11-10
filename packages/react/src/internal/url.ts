/**
 * @module internal/url
 *
 * URL checks shared by the components that render links and media.
 *
 * @internal
 */

/** The scheme of a URL, lowercased, after stripping control characters and whitespace. */
function schemeOf(url: string): string {
  // Browsers ignore control characters and whitespace inside a scheme (`java\tscript:`).
  // eslint-disable-next-line no-control-regex
  const compact = url.replace(/[\u0000- \u007f]/g, '').toLowerCase();
  const match = /^([a-z][a-z0-9+.-]*):/.exec(compact);
  return match ? match[1]! : '';
}

/** Whether a link `href` is safe to render: not `javascript:`, `vbscript:` or `data:`. */
export function isSafeHref(href: string): boolean {
  return !['javascript', 'vbscript', 'data'].includes(schemeOf(href));
}

/** Whether a media `src` is safe to render: not `javascript:` or `vbscript:` (`data:` images are fine). */
export function isSafeMediaSrc(src: string): boolean {
  return !['javascript', 'vbscript'].includes(schemeOf(src));
}

/** An href with unsafe schemes dropped, so the caller treats it as absent. */
export function safeHref(href: string | undefined): string | undefined {
  return href !== undefined && isSafeHref(href) ? href : undefined;
}
