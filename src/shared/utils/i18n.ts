import { type Dictionary } from '@/shared/const/dictionaries.const';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/shared/const/i18n.const';

export type MessageParams = Record<string, string | number>;

/** Replaces `{name}` placeholders; unknown placeholders are left as-is. */
export function formatMessage(template: string, params: MessageParams = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    params[name] === undefined ? match : String(params[name])
  );
}

export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

/** Cookie wins; otherwise Georgian when the browser prefers it; otherwise the default. */
export function resolveLocale(cookieValue?: string | null, acceptLanguage?: string | null): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  const preferred = acceptLanguage?.split(',')[0]?.trim().toLowerCase() ?? '';
  if (preferred.startsWith('ka')) return 'ka';
  return DEFAULT_LOCALE;
}

export type LocalizedMeta = { label: string; labelKa: string };

export function localizedLabel(meta: LocalizedMeta, locale: Locale): string {
  return locale === 'ka' ? meta.labelKa : meta.label;
}

export type ErrorKey = keyof Dictionary['errors'];

function isErrorKey(t: Dictionary, key: string): key is ErrorKey {
  return Object.prototype.hasOwnProperty.call(t.errors, key);
}

/** Server error codes (e.g. EMAIL_TAKEN) are translated; anything else falls back to a generic message. */
export function translateError(t: Dictionary, error: unknown, fallback: ErrorKey): string {
  const code = error instanceof Error ? error.message : '';
  return isErrorKey(t, code) ? t.errors[code] : t.errors[fallback];
}

/** Zod messages are dictionary keys (e.g. 'invalidEmail'); unknown messages are shown unchanged. */
export function translateValidation(t: Dictionary, message: string): string {
  return Object.prototype.hasOwnProperty.call(t.validation, message)
    ? t.validation[message as keyof Dictionary['validation']]
    : message;
}
