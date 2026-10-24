import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader, Noto_Sans_Georgian, Noto_Serif_Georgian } from 'next/font/google';
import { type ReactNode } from 'react';

import { APP_NAME } from '@/shared/const/app.const';
import { DICTIONARIES } from '@/shared/const/dictionaries.const';
import { cn } from '@/shared/lib/utils';
import { I18nProvider } from '@/shared/providers/i18n-provider';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { getServerLocale } from '@/shared/utils/server-locale';

import type { Metadata } from 'next';

import './globals.css';

const plexSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

/** Editorial display serif for headings. */
const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

/** The Latin faces have no Georgian glyphs; these cover Mkhedruli body text and headings. */
const notoSansGeorgian = Noto_Sans_Georgian({
  variable: '--font-georgian',
  subsets: ['georgian'],
  weight: ['400', '500', '600'],
});

const notoSerifGeorgian = Noto_Serif_Georgian({
  variable: '--font-georgian-serif',
  subsets: ['georgian'],
  weight: ['400', '500', '600'],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: APP_NAME,
    description: DICTIONARIES[locale].meta.description,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={cn(
        plexSans.variable,
        newsreader.variable,
        plexMono.variable,
        notoSansGeorgian.variable,
        notoSerifGeorgian.variable,
        'h-full antialiased'
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale}>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
