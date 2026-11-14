/**
 * @module internal/merge
 *
 * Merges a consumer's attributes with a behavior part's props, the way Zag
 * merges props: event handlers all run (the machine's first), `style` and
 * `className` combine, and for other attributes the part's value wins unless
 * it's undefined. A plain `{...rest} {...part}` spread would drop the
 * consumer's `onClick`, `style` and the like.
 *
 * @internal
 */

import { mergeProps } from '@zag-js/react';

/** The consumer's `own` attributes merged with a behavior part's `part` props. */
export function mergePartProps<T extends object>(own: T, part: object): T {
  return mergeProps(own as Record<string, unknown>, part as Record<string, unknown>) as T;
}
