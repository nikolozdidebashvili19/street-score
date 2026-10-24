import { EN_APP_DICTIONARY, type AppDictionary } from '@/shared/const/dictionary-en-app.const';
import { EN_SITE_DICTIONARY, type SiteDictionary } from '@/shared/const/dictionary-en.const';
import { KA_APP_DICTIONARY } from '@/shared/const/dictionary-ka-app.const';
import { KA_SITE_DICTIONARY } from '@/shared/const/dictionary-ka.const';
import { type Locale } from '@/shared/const/i18n.const';

export type Dictionary = SiteDictionary & AppDictionary;

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: { ...EN_SITE_DICTIONARY, ...EN_APP_DICTIONARY },
  ka: { ...KA_SITE_DICTIONARY, ...KA_APP_DICTIONARY },
};
