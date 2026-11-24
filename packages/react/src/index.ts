/**
 * @module @artisanpack-ui/react
 *
 * The main entry point for the ArtisanPack UI React component library.
 * Re-exports all components, hooks and providers. Each component's types are
 * exported alongside it.
 *
 * @packageDocumentation
 */

// Components
export * from './components/form';
export * from './components/layout';
export * from './components/navigation';
export * from './components/data';
export * from './components/feedback';
export * from './components/utility';

// The icon registry (`registerIcons`, `UnsafeIconError`) is re-exported from ./components/form.

// Hooks & Providers
export { ThemeProvider, useTheme } from './hooks/use-theme';
export type { ThemeContextValue, ColorScheme } from './hooks/use-theme';

// Translations
export {
  TranslationProvider,
  useTranslator,
  createTranslator,
  formatMessage,
  selectPluralForm,
  toLanguageTag,
} from './i18n/translator';
export type {
  TranslationMessages,
  TranslationParams,
  TranslateFunction,
  TranslateChoiceFunction,
  Translator,
  TranslationProviderProps,
} from './i18n/translator';
