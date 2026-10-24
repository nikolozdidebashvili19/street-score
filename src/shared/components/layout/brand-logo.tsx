import Link from 'next/link';

import { APP_NAME } from '@/shared/const/app.const';

const PIN_PATH =
  'M12 1.5c-4.4 0-8 3.4-8 7.8 0 5.6 6.9 12.6 7.3 12.9.4.4 1 .4 1.4 0 .4-.3 7.3-7.3 7.3-12.9 0-4.4-3.6-7.8-8-7.8Z' +
  'm0 10.8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z';

/** Wordmark: a brick pin mark with the name set in the display serif. */
export const BrandLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="size-6 fill-brick" aria-hidden="true">
        <path d={PIN_PATH} />
      </svg>
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground">{APP_NAME}</span>
    </Link>
  );
};
