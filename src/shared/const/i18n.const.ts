export const LOCALES = ['en', 'ka'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_COOKIE = 'sp-locale';

export const LOCALE_COOKIE_MAX_AGE_S = 60 * 60 * 24 * 365;

/** Shown on the switch button: the language you switch *to*. */
export const LOCALE_SWITCH_LABEL: Record<Locale, string> = {
  en: 'ქართ',
  ka: 'ENG',
};

export const DATE_LOCALE: Record<Locale, string> = {
  en: 'en-GB',
  ka: 'ka-GE',
};
