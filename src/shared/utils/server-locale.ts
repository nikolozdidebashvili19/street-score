import { cookies, headers } from 'next/headers';

import { LOCALE_COOKIE, type Locale } from '@/shared/const/i18n.const';
import { resolveLocale } from '@/shared/utils/i18n';

/** Locale for server components: the locale cookie, else the browser's Accept-Language. */
export async function getServerLocale(): Promise<Locale> {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, headerList.get('accept-language'));
}
