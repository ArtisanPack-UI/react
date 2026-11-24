#!/usr/bin/env node
/**
 * Keeps each package's translation catalogues in step with its source (#77).
 *
 *   node scripts/i18n.mjs extract   Rewrites lang/en.json from the t() and tChoice() calls.
 *   node scripts/i18n.mjs check     Fails when en.json and the source disagree, or when a
 *                                   locale file is missing keys, has stale keys, has empty
 *                                   values or changes a string's {placeholders}.
 *
 * Keys are the English text passed as a string literal to t('…') or tChoice('…').
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// react-laravel wraps these components and has no text of its own.
const packages = ['packages/react'];

const CALL = /\b(?:t|tChoice)\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1/g;

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.(test|stories)\.tsx?$/.test(name) ? [path] : [];
  });
}

function unescape(literal, quote) {
  return literal.replace(/\\(.)/g, (_, char) => (char === 'n' ? '\n' : char === quote ? quote : char));
}

function extract(pkg) {
  const keys = new Set();
  for (const file of sourceFiles(join(root, pkg, 'src'))) {
    for (const match of readFileSync(file, 'utf8').matchAll(CALL)) {
      keys.add(unescape(match[2], match[1]));
    }
  }
  return [...keys].sort((a, b) => a.localeCompare(b, 'en'));
}

// `{name}` placeholders, plus the Laravel-style `:name` ones @artisanpack-ui/behavior fills.
const placeholders = (text) =>
  [...text.matchAll(/\{(\w+)\}|(?<![\w:]):([a-zA-Z]\w*)/g)]
    .map((m) => m[1] ?? `:${m[2]}`)
    .sort()
    .join(',');

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

const mode = process.argv[2];
const errors = [];

for (const pkg of packages) {
  const langDir = join(root, pkg, 'lang');
  const enPath = join(langDir, 'en.json');
  const keys = extract(pkg);

  if (mode === 'extract') {
    const catalogue = Object.fromEntries(keys.map((key) => [key, key]));
    writeFileSync(enPath, JSON.stringify(catalogue, null, 2) + '\n');
    console.log(`${relative(root, enPath)}: ${keys.length} strings`);
    continue;
  }

  const en = readJson(enPath);
  const enKeys = Object.keys(en);
  for (const key of keys) if (!Object.hasOwn(en, key)) errors.push(`${pkg}/lang/en.json is missing "${key}"`);
  for (const key of enKeys) {
    if (!keys.includes(key)) errors.push(`${pkg}/lang/en.json has "${key}", which no t() call uses`);
    if (en[key] !== key) errors.push(`${pkg}/lang/en.json: "${key}" must map to itself`);
  }

  for (const file of readdirSync(langDir).filter((name) => name.endsWith('.json') && name !== 'en.json')) {
    const locale = readJson(join(langDir, file));
    const label = `${pkg}/lang/${file}`;
    const tag = file.replace(/\.json$/, '').replaceAll('_', '-');
    const categories = new Intl.PluralRules(tag).resolvedOptions().pluralCategories.length;
    for (const key of enKeys) {
      if (!Object.hasOwn(locale, key)) errors.push(`${label} is missing "${key}"`);
      else if (typeof locale[key] !== 'string' || locale[key].trim() === '') errors.push(`${label}: "${key}" is empty`);
      else if (key.includes('|')) {
        // Plural forms: one per CLDR category, each with the English plural form's
        // placeholders. {count} may be spelled out (Arabic "one"/"two" forms).
        const forms = locale[key].split('|');
        if (forms.length !== categories) {
          errors.push(`${label}: "${key}" needs ${categories} plural form(s), has ${forms.length}`);
        }
        const english = placeholders(key.split('|').at(-1));
        const allowed = new Set(placeholders(key).split(',').filter(Boolean));
        const withoutCount = (list) => list.split(',').filter((name) => name !== '' && name !== 'count').join(',');
        for (const form of forms) {
          const found = placeholders(form);
          const unknown = found.split(',').some((name) => name !== '' && !allowed.has(name));
          if (withoutCount(found) !== withoutCount(english) || unknown) {
            errors.push(`${label}: "${key}" form "${form}" must keep the placeholders ${english}`);
          }
        }
      } else if (placeholders(locale[key]) !== placeholders(key)) {
        errors.push(`${label}: "${key}" must keep the placeholders ${placeholders(key)}`);
      }
    }
    for (const key of Object.keys(locale)) {
      if (!Object.hasOwn(en, key)) errors.push(`${label} has "${key}", which en.json doesn't`);
    }
  }
}

if (mode === 'check') {
  if (errors.length) {
    console.error(errors.join('\n'));
    console.error(`\n${errors.length} translation problem(s). Run \`npm run i18n:extract\` after changing t() calls.`);
    process.exit(1);
  }
  console.log('Translations are in step.');
} else if (mode !== 'extract') {
  console.error('Usage: node scripts/i18n.mjs <extract|check>');
  process.exit(2);
}
