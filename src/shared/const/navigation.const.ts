export type SidebarNavItem = {
  href: string;
  /** Label lives in the dictionaries under `nav.<key>`. */
  key: 'explorer' | 'saved' | 'compare';
};

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { href: '/explorer', key: 'explorer' },
  { href: '/locations', key: 'saved' },
  { href: '/compare', key: 'compare' },
];
