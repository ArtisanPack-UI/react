import { render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  TranslationProvider,
  createTranslator,
  formatMessage,
  selectPluralForm,
  toLanguageTag,
  useTranslator,
} from '../../i18n/translator';
import en from '../../../lang/en.json';

const catalogues = import.meta.glob<Record<string, string>>('../../../lang/*.json', {
  import: 'default',
  eager: true,
});

describe('formatMessage', () => {
  it('fills placeholders and leaves unknown ones', () => {
    expect(formatMessage('Page {page} of {pageCount}', { page: 2, pageCount: 9 })).toBe(
      'Page 2 of 9',
    );
    expect(formatMessage('Hello {name}', {})).toBe('Hello {name}');
    expect(formatMessage('Hello {name}')).toBe('Hello {name}');
  });
});

describe('toLanguageTag', () => {
  it('turns a Laravel locale into a BCP 47 tag', () => {
    expect(toLanguageTag('pt_BR')).toBe('pt-BR');
    expect(toLanguageTag('zh_CN')).toBe('zh-CN');
    expect(toLanguageTag('es')).toBe('es');
  });
});

describe('selectPluralForm', () => {
  it('follows English rules', () => {
    expect(selectPluralForm('{count} item|{count} items', 1, 'en')).toBe('{count} item');
    expect(selectPluralForm('{count} item|{count} items', 0, 'en')).toBe('{count} items');
    expect(selectPluralForm('{count} item|{count} items', 5, 'en')).toBe('{count} items');
  });

  it('uses the only form for a locale without plurals', () => {
    expect(selectPluralForm('{count} 件', 1, 'ja')).toBe('{count} 件');
  });

  it("orders Arabic's six categories zero, one, two, few, many, other", () => {
    const forms = 'zero|one|two|few|many|other';
    expect(selectPluralForm(forms, 0, 'ar')).toBe('zero');
    expect(selectPluralForm(forms, 1, 'ar')).toBe('one');
    expect(selectPluralForm(forms, 2, 'ar')).toBe('two');
    expect(selectPluralForm(forms, 3, 'ar')).toBe('few');
    expect(selectPluralForm(forms, 11, 'ar')).toBe('many');
    expect(selectPluralForm(forms, 100, 'ar')).toBe('other');
  });

  it('gives one the first form and every other category the last when a translation has too few', () => {
    expect(selectPluralForm('one|other', 1, 'ar')).toBe('one');
    expect(selectPluralForm('one|other', 0, 'ar')).toBe('other');
    expect(selectPluralForm('one|other', 2, 'ar')).toBe('other');
    expect(selectPluralForm('one|other', 3, 'ar')).toBe('other');
  });

  it('keeps the right forms on a runtime whose CLDR data lacks a category', () => {
    const Native = Intl.PluralRules;
    // An older engine: Spanish with only one and other, no many.
    class OldPluralRules extends Native {
      resolvedOptions() {
        return {
          ...super.resolvedOptions(),
          pluralCategories: ['one', 'other'] as Intl.LDMLPluralRule[],
        };
      }
      select(count: number) {
        return count === 1 ? 'one' : 'other';
      }
    }
    vi.stubGlobal('Intl', { ...Intl, PluralRules: OldPluralRules });
    try {
      const forms = '{count} campo|{count} de campos|{count} campos';
      expect(selectPluralForm(forms, 1, 'es')).toBe('{count} campo');
      expect(selectPluralForm(forms, 2, 'es')).toBe('{count} campos');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('falls back to English rules for an unknown locale', () => {
    expect(selectPluralForm('one|other', 1, 'not a locale!')).toBe('one');
  });
});

describe('createTranslator', () => {
  it('returns English without a catalogue', () => {
    const { t, tChoice, locale } = createTranslator();
    expect(locale).toBeUndefined();
    expect(t('Close')).toBe('Close');
    expect(tChoice('{count} file|{count} files', 2)).toBe('2 files');
  });

  it('translates from the catalogue and keeps English for missing or empty keys', () => {
    const { t, locale } = createTranslator('pt_BR', { Close: 'Fechar', Open: '' });
    expect(locale).toBe('pt-BR');
    expect(t('Close')).toBe('Fechar');
    expect(t('Open')).toBe('Open');
    expect(t('Missing')).toBe('Missing');
  });

  it('applies the locale plural rules to translated forms', () => {
    const { tChoice } = createTranslator('fr', {
      '{count} file|{count} files': '{count} fichier|{count} fichiers',
    });
    expect(tChoice('{count} file|{count} files', 0)).toBe('0 fichier');
    expect(tChoice('{count} file|{count} files', 3)).toBe('3 fichiers');
  });
});

describe('TranslationProvider', () => {
  function Probe() {
    const { t, locale } = useTranslator();
    return (
      <span>
        {t('Close')} {locale ?? 'none'}
      </span>
    );
  }

  it('gives English without a provider', () => {
    render(<Probe />);
    expect(screen.getByText('Close none')).toBeInTheDocument();
  });

  it('translates for the components below it, the nearest provider winning', () => {
    render(
      <TranslationProvider locale="es" messages={{ Close: 'Cerrar' }}>
        <Probe />
        <TranslationProvider locale="de" messages={{ Close: 'Schließen' }}>
          <Probe />
        </TranslationProvider>
      </TranslationProvider>,
    );
    expect(screen.getByText('Cerrar es')).toBeInTheDocument();
    expect(screen.getByText('Schließen de')).toBeInTheDocument();
  });

  it('keeps the same translator across renders with the same inputs', () => {
    const messages = { Close: 'Cerrar' };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TranslationProvider locale="es" messages={messages}>
        {children}
      </TranslationProvider>
    );
    const { result, rerender } = renderHook(() => useTranslator(), { wrapper });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('keeps the translator when the catalogue is rebuilt inline with the same entries', () => {
    let entries: Record<string, string> = { Close: 'Cerrar' };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TranslationProvider locale="es" messages={{ ...entries }}>
        {children}
      </TranslationProvider>
    );
    const { result, rerender } = renderHook(() => useTranslator(), { wrapper });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);

    entries = { Close: 'Salir' };
    rerender();
    expect(result.current).not.toBe(first);
    expect(result.current.t('Close')).toBe('Salir');
  });
});

describe('the shipped catalogues', () => {
  const locales = ['es', 'fr', 'de', 'pt_BR', 'ja', 'zh_CN', 'it', 'ar'];

  it.each(locales)('ships %s with every English key', (locale) => {
    const catalogue = catalogues[`../../../lang/${locale}.json`];
    expect(catalogue).toBeDefined();
    expect(Object.keys(catalogue).sort()).toEqual(Object.keys(en).sort());
  });

  it.each(locales)('gives every plural key in %s the forms its locale uses', (locale) => {
    const catalogue = catalogues[`../../../lang/${locale}.json`];
    const categories = new Intl.PluralRules(toLanguageTag(locale)).resolvedOptions()
      .pluralCategories.length;
    for (const key of Object.keys(en).filter((key) => key.includes('|'))) {
      expect(catalogue[key].split('|'), `${locale}: ${key}`).toHaveLength(categories);
    }
  });
});
