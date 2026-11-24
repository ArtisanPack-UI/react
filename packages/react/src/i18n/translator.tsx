/**
 * @module i18n
 *
 * Translations for the components' built-in text (#77): accessible names,
 * placeholders, empty states and the like. Every string is keyed by its
 * English text, the same way Laravel's JSON translation files are, so a
 * component renders English when no {@link TranslationProvider} is mounted.
 *
 * The package ships a catalogue per locale under `@artisanpack-ui/react/lang`.
 * Pass one (merged with your own overrides) to the provider:
 *
 * ```tsx
 * import es from '@artisanpack-ui/react/lang/es.json';
 *
 * <TranslationProvider locale="es" messages={{ ...es, Close: 'Salir' }}>
 *   <App />
 * </TranslationProvider>
 * ```
 *
 * A prop always wins over the catalogue: `<Dialog closeLabel="…">` keeps its
 * text whatever the locale.
 *
 * @packageDocumentation
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

/** A catalogue: English text to translated text. */
export type TranslationMessages = Readonly<Record<string, string>>;

/** Values for a string's `{name}` placeholders. */
export type TranslationParams = Readonly<Record<string, string | number>>;

/** Translates a string, filling its `{name}` placeholders. */
export type TranslateFunction = (key: string, params?: TranslationParams) => string;

/**
 * Translates a string with plural forms and fills `{count}` and the other
 * placeholders. The forms are separated by `|`, one per CLDR plural category
 * the locale uses, in the order zero, one, two, few, many, other: English
 * `'{count} item|{count} items'`, Japanese a single form, Arabic six.
 */
export type TranslateChoiceFunction = (
  key: string,
  count: number,
  params?: TranslationParams,
) => string;

/** What {@link useTranslator} returns. */
export interface Translator {
  /** Translates a string. */
  t: TranslateFunction;
  /** Translates a string with plural forms. */
  tChoice: TranslateChoiceFunction;
  /**
   * The provider's locale as a BCP 47 tag (`pt_BR` becomes `pt-BR`), or
   * `undefined` without a provider. Components that format dates use it
   * unless given their own `locale`.
   */
  locale: string | undefined;
}

/** Props for the {@link TranslationProvider}. */
export interface TranslationProviderProps {
  /** The locale, as a BCP 47 tag or a Laravel locale (`pt_BR`). Picks the plural rules. */
  locale: string;
  /** The catalogue. Strings missing from it render in English. */
  messages?: TranslationMessages;
  children?: ReactNode;
}

const CATEGORY_ORDER: readonly Intl.LDMLPluralRule[] = [
  'zero',
  'one',
  'two',
  'few',
  'many',
  'other',
];

/** Turns a Laravel locale (`pt_BR`) into a BCP 47 tag (`pt-BR`). */
export function toLanguageTag(locale: string): string {
  return locale.replaceAll('_', '-');
}

/** Fills each `{name}` placeholder in `text` with its value from `params`. */
export function formatMessage(text: string, params?: TranslationParams): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}

/**
 * Picks the plural form for `count` from `|`-separated `forms` under the
 * locale's rules. When the form count doesn't match the runtime's categories
 * (a translation with too few forms, or an older browser whose CLDR data lacks
 * a category the catalogue has), `one` takes the first form and every other
 * category the last, so the result is never a form meant for another count.
 */
export function selectPluralForm(forms: string, count: number, locale = 'en'): string {
  const parts = forms.split('|');
  if (parts.length === 1) return parts[0];
  let rules: Intl.PluralRules;
  try {
    rules = new Intl.PluralRules(toLanguageTag(locale));
  } catch {
    rules = new Intl.PluralRules('en');
  }
  const categories = CATEGORY_ORDER.filter((category) =>
    rules.resolvedOptions().pluralCategories.includes(category),
  );
  const category = rules.select(count);
  if (parts.length === categories.length) return parts[categories.indexOf(category)];
  return category === 'one' ? parts[0] : parts[parts.length - 1];
}

/** Whether two catalogues hold the same entries. */
function sameMessages(a: TranslationMessages | undefined, b: TranslationMessages | undefined) {
  if (a === b) return true;
  if (!a || !b) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key]);
}

/** Builds a {@link Translator} from a locale and a catalogue. */
export function createTranslator(locale?: string, messages: TranslationMessages = {}): Translator {
  const lookup = (key: string) => {
    const value = messages[key];
    return typeof value === 'string' && value !== '' ? value : undefined;
  };
  return {
    locale: locale === undefined ? undefined : toLanguageTag(locale),
    t: (key, params) => formatMessage(lookup(key) ?? key, params),
    tChoice: (key, count, params) => {
      const translated = lookup(key);
      // English forms follow English plural rules when the catalogue has no entry.
      const form = selectPluralForm(translated ?? key, count, translated ? locale : 'en');
      return formatMessage(form, { count, ...params });
    },
  };
}

const englishTranslator = createTranslator();

const TranslationContext = createContext<Translator>(englishTranslator);

/**
 * Gives the components below it a locale and a catalogue for their built-in
 * text. Providers nest; the nearest one wins. A `messages` object rebuilt on
 * every render with the same entries (`{ ...es, Close: 'Salir' }` inline)
 * keeps the same translator, so the components below don't re-render for it.
 */
export function TranslationProvider({ locale, messages, children }: TranslationProviderProps) {
  const [catalogue, setCatalogue] = useState(messages);
  if (!sameMessages(catalogue, messages)) setCatalogue(messages);
  const translator = useMemo(() => createTranslator(locale, catalogue), [locale, catalogue]);
  return <TranslationContext.Provider value={translator}>{children}</TranslationContext.Provider>;
}

/** The nearest {@link TranslationProvider}'s translator, or English without one. */
export function useTranslator(): Translator {
  return useContext(TranslationContext);
}
