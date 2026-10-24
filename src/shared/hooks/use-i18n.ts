'use client';
import { useContext, useMemo } from 'react';

import { DICTIONARIES } from '@/shared/const/dictionaries.const';
import { I18nContext } from '@/shared/providers/i18n-provider';
import { formatMessage, localizedLabel, type LocalizedMeta } from '@/shared/utils/i18n';

export const useI18n = () => {
  const locale = useContext(I18nContext);

  return useMemo(
    () => ({
      locale,
      t: DICTIONARIES[locale],
      format: formatMessage,
      label: (meta: LocalizedMeta) => localizedLabel(meta, locale),
    }),
    [locale]
  );
};
