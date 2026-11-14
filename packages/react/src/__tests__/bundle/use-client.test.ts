/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';

/*
 * The built modules are client modules for React Server Components: the tsup
 * banner puts 'use client' first in every entry and chunk. It checks the
 * output, so it runs after `npm run build` (as in CI) and is skipped without it.
 */
const code = import.meta.glob<string>('../../../dist/*.mjs', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const maps = import.meta.glob<string>('../../../dist/*.mjs.map', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const modules = Object.keys(code).map((path) => path.replace('../../../dist/', ''));

describe.skipIf(modules.length === 0)("the built output's 'use client' directive", () => {
  it.each(modules)('is the first statement of %s', (file) => {
    const source = code[`../../../dist/${file}`];
    expect(source.startsWith("'use client';\n")).toBe(true);
    expect(source.match(/['"]use client['"]/g)).toHaveLength(1);
  });

  it.each(modules)("keeps %s's source map in step with the banner line", (file) => {
    const map = JSON.parse(maps[`../../../dist/${file}.map`]) as { mappings: string };
    // An empty map (a re-export-only entry) has nothing to shift.
    if (map.mappings !== '') expect(map.mappings.startsWith(';')).toBe(true);
  });
});
