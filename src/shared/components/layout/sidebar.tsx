'use client';
import { Bookmark, Columns3, MapPinned, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDEBAR_NAV_ITEMS, type SidebarNavItem } from '@/shared/const/navigation.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

const SIDEBAR_ICON_MAP: Record<SidebarNavItem['key'], LucideIcon> = {
  explorer: MapPinned,
  saved: Bookmark,
  compare: Columns3,
};

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export const Sidebar = ({ className, onNavigate }: SidebarProps) => {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className={cn('flex w-60 shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar px-3 py-4', className)}>
      <p className="px-3 pb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t.common.workspace}</p>
      <nav className="flex flex-col">
        {SIDEBAR_NAV_ITEMS.map(({ href, key }) => {
          const Icon = SIDEBAR_ICON_MAP[key];
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 border-l-2 px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'border-brick bg-sidebar-accent font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              <Icon className={cn('size-4 shrink-0', isActive && 'text-brick')} />
              {t.nav[key]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
