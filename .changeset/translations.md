---
'@artisanpack-ui/react': minor
---

Translate the components' built-in text.

- New `TranslationProvider` and `useTranslator()` (also from `@artisanpack-ui/react/i18n`). Wrap the app in the provider with a locale and a catalogue, and every built-in accessible name, placeholder, empty state and message renders in that language. Without a provider the components stay in English, and a prop such as `closeLabel` still wins over the catalogue.
- Catalogues keyed by the English text ship under `@artisanpack-ui/react/lang/*.json` for `en`, `es`, `fr`, `de`, `pt_BR`, `ja`, `zh_CN`, `it` and `ar`. Spread one and add your own overrides: `messages={{ ...es, Close: 'Salir' }}`. A catalogue rebuilt with the same entries on every render doesn't re-render the components. The non-English catalogues are machine-translated first passes awaiting review by fluent speakers.
- Strings with plural forms use `|`-separated forms in CLDR order (zero, one, two, few, many, other), picked with `Intl.PluralRules` for the locale.
- `Breadcrumbs` names its overflow button in the singular for one hidden level: "Show 1 more level" (it was "Show 1 more levels").
- `DatePicker` and `Calendar` format dates in the provider's locale unless given their own `locale`.
