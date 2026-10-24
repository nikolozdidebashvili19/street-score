'use client';
import { createContext, type ReactNode } from 'react';

import { DEFAULT_LOCALE, type Locale } from '@/shared/const/i18n.const';

export const I18nContext = createContext<Locale>(DEFAULT_LOCALE);

type I18nProviderProps = {
  locale: Locale;
  children: ReactNode;
};

export const I18nProvider = ({ locale, children }: I18nProviderProps) => {
  return <I18nContext.Provider value={locale}>{children}</I18nContext.Provider>;
};
