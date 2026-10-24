import { describe, it, expect } from 'vitest';

import { DICTIONARIES } from '@/shared/const/dictionaries.const';

import {
  formatMessage,
  localizedLabel,
  resolveLocale,
  translateError,
  translateValidation,
} from './i18n';

const en = DICTIONARIES.en;
const ka = DICTIONARIES.ka;

describe('formatMessage', () => {
  it('fills placeholders and keeps unknown ones', () => {
    expect(formatMessage('{count} cafés within {radius} m', { count: 3, radius: 500 })).toBe('3 cafés within 500 m');
    expect(formatMessage('Hello {name}')).toBe('Hello {name}');
  });
});

describe('resolveLocale', () => {
  it('prefers a valid cookie', () => {
    expect(resolveLocale('ka', 'en-US')).toBe('ka');
    expect(resolveLocale('en', 'ka-GE')).toBe('en');
  });

  it('falls back to the browser language, then English', () => {
    expect(resolveLocale(undefined, 'ka-GE,ka;q=0.9,en;q=0.8')).toBe('ka');
    expect(resolveLocale('fr', 'de-DE')).toBe('en');
    expect(resolveLocale(null, null)).toBe('en');
  });
});

describe('localizedLabel', () => {
  it('picks the Georgian label for ka', () => {
    const meta = { label: 'Bakery', labelKa: 'საცხობი' };
    expect(localizedLabel(meta, 'ka')).toBe('საცხობი');
    expect(localizedLabel(meta, 'en')).toBe('Bakery');
  });
});

describe('translateError', () => {
  it('translates known server error codes', () => {
    expect(translateError(ka, new Error('EMAIL_TAKEN'), 'registrationFailed')).toBe(ka.errors.EMAIL_TAKEN);
  });

  it('falls back for unknown errors', () => {
    expect(translateError(en, new Error('boom'), 'saveFailed')).toBe(en.errors.saveFailed);
    expect(translateError(en, 'not an error', 'saveFailed')).toBe(en.errors.saveFailed);
  });
});

describe('translateValidation', () => {
  it('translates message keys and passes other text through', () => {
    expect(translateValidation(ka, 'invalidEmail')).toBe(ka.validation.invalidEmail);
    expect(translateValidation(en, 'Too long')).toBe('Too long');
  });
});

describe('dictionaries', () => {
  it('Georgian has every key English has, with non-empty values', () => {
    const flatten = (value: object, prefix = ''): string[] =>
      Object.entries(value).flatMap(([key, child]) =>
        typeof child === 'object' ? flatten(child, `${prefix}${key}.`) : [`${prefix}${key}`]
      );
    expect(flatten(ka).sort()).toEqual(flatten(en).sort());
  });

  it('keeps the same placeholders in both languages', () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
    expect(placeholders(ka.score.evidence.rent)).toEqual(placeholders(en.score.evidence.rent));
    expect(placeholders(ka.score.evidence.surroundings)).toEqual(placeholders(en.score.evidence.surroundings));
    expect(placeholders(ka.compare.competitorsMapped)).toEqual(placeholders(en.compare.competitorsMapped));
  });
});
