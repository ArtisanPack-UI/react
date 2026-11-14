/**
 * @module internal/parts
 *
 * Small helpers shared by the design-system components: class joining, the
 * per-part `classes` map, present-empty boolean data attributes, and the
 * "is this slot/prop worth rendering" test.
 *
 * @internal
 */

import type { ReactNode } from 'react';

/** Extra classes per part, such as `{ root: '…', label: '…' }`. */
export type PartClasses<Part extends string> = Partial<Record<Part, string>>;

/** Joins class names, dropping empty values. Returns `undefined` when nothing is left. */
export function cx(...values: (string | false | null | undefined)[]): string | undefined {
  const joined = values.filter(Boolean).join(' ');
  return joined === '' ? undefined : joined;
}

/** A present-empty boolean data attribute: `''` when on, absent when off. */
export function flag(on: boolean | undefined): '' | undefined {
  return on ? '' : undefined;
}

/** Whether a slot/prop value renders anything (not null, undefined, false or an empty string). */
export function hasContent(value: ReactNode): boolean {
  return value !== undefined && value !== null && value !== false && value !== '';
}

const warned = new Set<string>();

function isProduction(): boolean {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env?.NODE_ENV === 'production';
}

/** Warns once per key, outside production builds. */
export function devWarnOnce(key: string, message: string): void {
  if (isProduction() || warned.has(key)) return;
  warned.add(key);
  console.warn(`[@artisanpack-ui/react] ${message}`);
}
