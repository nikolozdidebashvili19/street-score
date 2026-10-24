'use client';
import {
  PLAN_BLOCKS,
  PLAN_POINTS,
  PLAN_RADIUS,
  PLAN_RIVER_PATH,
  PLAN_SITES,
  PLAN_STOPS,
  PLAN_VIEWBOX,
  type PlanPoint,
} from '@/shared/const/home.const';
import { MAP_LEGEND } from '@/shared/const/map.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

const POINT_FILL: Record<PlanPoint['role'], string> = {
  competitor: 'fill-brick',
  activity: 'fill-positive',
  transport: 'fill-transport',
  context: 'fill-muted-foreground/50',
};

type StreetPlanFigureProps = {
  className?: string;
};

/** Fig. 1 — a printed-plan drawing of the two storefronts from the example table. */
export const StreetPlanFigure = ({ className }: StreetPlanFigureProps) => {
  const { t } = useI18n();

  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <svg viewBox={PLAN_VIEWBOX} role="img" aria-label={t.home.plan.title} className="block h-auto w-full">
          {PLAN_BLOCKS.map((block) => (
            <rect key={`${block.x}-${block.y}`} {...block} rx="2" className="fill-secondary" />
          ))}
          <path d={PLAN_RIVER_PATH} className="fill-transport/20" />

          {PLAN_SITES.map((site) => (
            <circle
              key={`radius-${site.letter}`}
              cx={site.x}
              cy={site.y}
              r={PLAN_RADIUS}
              strokeWidth="1.25"
              strokeDasharray="4 4"
              className="fill-foreground/5 stroke-foreground/60"
            />
          ))}

          {PLAN_POINTS.map((point) => (
            <circle
              key={`${point.role}-${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r={point.role === 'competitor' ? 4.5 : 3.5}
              strokeWidth="1.5"
              className={cn('stroke-card', POINT_FILL[point.role])}
            />
          ))}
          {PLAN_STOPS.map(([x, y]) => (
            <rect key={`stop-${x}-${y}`} x={x - 3.5} y={y - 3.5} width="7" height="7" strokeWidth="1.5" className="fill-transport stroke-card" />
          ))}

          {PLAN_SITES.map((site) => (
            <g key={site.letter} aria-label={`${t.home.plan.site} ${site.letter}`}>
              <circle cx={site.x} cy={site.y} r="11" strokeWidth="2" className="fill-foreground stroke-card" />
              <text x={site.x} y={site.y + 4.5} textAnchor="middle" className="fill-background font-heading text-sm">
                {site.letter}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <figcaption className="flex flex-col gap-2">
        <span className="text-xs leading-relaxed text-muted-foreground">{t.home.plan.caption}</span>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {MAP_LEGEND.map(({ role, dotClassName }) => (
            <li key={role} className="flex items-center gap-1.5">
              <span className={cn('size-2 rounded-full', dotClassName)} aria-hidden="true" />
              {t.legend[role]}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
};
