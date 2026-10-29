export type AppNavItem = {
  href: string;
  /** Label lives in the dictionaries under `nav.<key>`. */
  key: 'explorer' | 'saved' | 'compare' | 'expansion';
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { href: '/explorer', key: 'explorer' },
  { href: '/locations', key: 'saved' },
  { href: '/compare', key: 'compare' },
  { href: '/expansion', key: 'expansion' },
];
