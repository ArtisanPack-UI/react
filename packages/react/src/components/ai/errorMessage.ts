/** @module ai/errorMessage */

/**
 * A displayable message for anything a request can reject with. Promises can
 * reject with non-Error values (`null`, strings, plain objects), and reading
 * `.message` off those must not throw inside an error handler.
 *
 * @internal
 */
export function errorMessage(reason: unknown, fallback = 'Something went wrong.'): string {
  if (reason instanceof Error && reason.message !== '') return reason.message;
  if (typeof reason === 'string' && reason !== '') return reason;
  return fallback;
}
