---
title: Translations
menu_order: 47
---

# Translations

The components' built-in text (accessible names, placeholders, empty states and messages, such as a Dialog's "Close" button or a Combobox's "No results") renders in English by default. Since 2.1, `TranslationProvider` renders it in another language from a catalogue.

## Set up

Wrap the app in a `TranslationProvider` with a locale and a catalogue:

```tsx
import { TranslationProvider } from '@artisanpack-ui/react';
import es from '@artisanpack-ui/react/lang/es.json';

export function App() {
  return (
    <TranslationProvider locale="es" messages={es}>
      <Routes />
    </TranslationProvider>
  );
}
```

Every component below the provider now renders its built-in text in Spanish. Without a provider the components stay in English.

`TranslationProvider` and `useTranslator` are exported from the package root and from `@artisanpack-ui/react/i18n`.

| Prop       | Type                     | What it does                                                                               |
| ---------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| `locale`   | `string`                 | A BCP 47 tag (`pt-BR`) or a Laravel locale (`pt_BR`). It picks the plural rules.           |
| `messages` | `Record<string, string>` | The catalogue: English text to translated text. Strings missing from it render in English. |

Providers nest, and the nearest one wins.

## Catalogues

The package ships a catalogue per locale under `@artisanpack-ui/react/lang/*.json`:

| Locale               | File         |
| -------------------- | ------------ |
| English              | `en.json`    |
| Spanish              | `es.json`    |
| French               | `fr.json`    |
| German               | `de.json`    |
| Brazilian Portuguese | `pt_BR.json` |
| Japanese             | `ja.json`    |
| Simplified Chinese   | `zh_CN.json` |
| Italian              | `it.json`    |
| Arabic               | `ar.json`    |

> **Note:** The non-English catalogues are machine-translated first passes awaiting review by fluent speakers. Override any string that reads wrong, and consider sending the fix upstream.

A catalogue is keyed by the English text, the same way Laravel's JSON translation files are. Spread one and add your own overrides:

```tsx
<TranslationProvider locale="es" messages={{ ...es, Close: 'Salir' }}>
```

A catalogue rebuilt with the same entries on every render, like the inline object above, doesn't re-render the components.

For a locale the package doesn't ship, start from `en.json` and translate its values.

## Props win over the catalogue

A label prop always wins over the catalogue, whatever the locale. `<Dialog closeLabel="Dismiss">` keeps "Dismiss" under a Spanish provider. Use the props for one-off wording and the catalogue for the language.

## Placeholders and plurals

Strings fill `{name}` placeholders, such as `{count}`. Strings with plural forms separate them with `|`, one per CLDR plural category the locale uses, in the order zero, one, two, few, many, other. English has two forms, Japanese one, Arabic six:

```json
{
  "Show {count} more level|Show {count} more levels": "Mostrar {count} nivel más|Mostrar {count} de niveles más|Mostrar {count} niveles más"
}
```

The form is picked with `Intl.PluralRules` for the provider's locale. When a translation has a different number of forms than the locale's categories, `one` takes the first form and every other count the last.

## Dates

`DatePicker` and `Calendar` format dates in the provider's locale unless given their own `locale` prop.

## Translating your own text

`useTranslator()` returns the nearest provider's translator, or an English one without a provider, so your own components can use the same catalogue:

```tsx
import { useTranslator } from '@artisanpack-ui/react';

function ResultCount({ count }: { count: number }) {
  const { t, tChoice } = useTranslator();

  return (
    <p>
      {tChoice('{count} result|{count} results', count)} · {t('Updated {time}', { time: '09:41' })}
    </p>
  );
}
```

| Returns                        | What it is                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| `t(key, params?)`              | Translates a string and fills its placeholders.                                              |
| `tChoice(key, count, params?)` | Picks the plural form for `count`, then fills `{count}` and the other placeholders.          |
| `locale`                       | The provider's locale as a BCP 47 tag (`pt_BR` becomes `pt-BR`), or `undefined` without one. |

Outside React, `createTranslator(locale, messages)` builds the same translator. `formatMessage`, `selectPluralForm` and `toLanguageTag` are exported too.

## With Laravel and Inertia

Share the app's locale from `HandleInertiaRequests` and pick the catalogue from it:

```php
public function share( Request $request ): array
{
    return [
        ...parent::share( $request ),
        'locale' => app()->getLocale(),
    ];
}
```

```tsx
import { usePage } from '@inertiajs/react';
import { TranslationProvider } from '@artisanpack-ui/react';
import en from '@artisanpack-ui/react/lang/en.json';
import es from '@artisanpack-ui/react/lang/es.json';

const catalogues: Record<string, Record<string, string>> = { en, es };

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { locale } = usePage<{ locale: string }>().props;

  return (
    <TranslationProvider locale={locale} messages={catalogues[locale] ?? en}>
      {children}
    </TranslationProvider>
  );
}
```

Declare `locale` on `SharedPageProps` to type it everywhere; see [TypeScript](typescript.md#shared-inertia-props).

## AI components

The [AI Components](ai-components.md) read the provider too. Their `labels` prop still wins over it, string by string.
