/**
 * @module internal/trigger
 *
 * Tooltip and Popover take the author's own control as their trigger
 * (D-019): the trigger part's props go on the element passed in, cloned,
 * rather than on a wrapper. The element keeps its own id (pass it to the
 * hook's `ids.trigger`), its handlers run alongside the machine's, its
 * classes are kept, and `aria-describedby` ids are joined.
 *
 * @internal
 */

import { cloneElement, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';

import { mergePartProps } from './merge';

/** The single element to use as a trigger, or `undefined` for text, fragments and lists. */
export function triggerElement(node: ReactNode): ReactElement<Record<string, unknown>> | undefined {
  if (!isValidElement(node) || node.type === Fragment) return undefined;
  return node as ReactElement<Record<string, unknown>>;
}

/** The element's own id, so the machine can name the trigger by it. */
export function triggerId(node: ReactNode): string | undefined {
  const id = triggerElement(node)?.props.id;
  return typeof id === 'string' && id !== '' ? id : undefined;
}

/** `element` with the trigger part's `props` merged in. */
export function cloneTrigger(
  element: ReactElement<Record<string, unknown>>,
  props: Record<string, unknown>,
): ReactElement {
  const own = element.props;
  const merged = mergePartProps(own, props) as Record<string, unknown>;
  const described = [own['aria-describedby'], props['aria-describedby']].filter(
    (value) => typeof value === 'string' && value !== '',
  );
  merged['aria-describedby'] = described.length ? described.join(' ') : undefined;
  if (typeof own.id === 'string' && own.id !== '') merged.id = own.id;
  return cloneElement(element, merged);
}
