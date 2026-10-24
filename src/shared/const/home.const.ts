import { type BusinessType } from '@/shared/const/business-types.const';
import { type ScoreFactorKey, type ScoreSourceKey } from '@/shared/const/scoring.const';
import { type PlaceRole } from '@/shared/utils/places';

/** Rows of the PRODUCT.md §2 example; text lives under home.example. Scores are illustrative. */
export const HOME_EXAMPLE_ROWS = ['advantage', 'risk', 'suits'] as const;

export const HOME_EXAMPLE_SCORES = { a: 82, b: 68 } as const;

/** The landing method table shows the café profile; every business type has its own weights. */
export const HOME_METHOD_BUSINESS_TYPE: BusinessType = 'cafe';

/** Each meter cell on the method table stands for this many weight points. */
export const HOME_METHOD_CELL_POINTS = 5;

export const HOME_METHOD_SOURCES: Record<ScoreFactorKey, ScoreSourceKey> = {
  activity: 'osm',
  competition: 'osm',
  surroundings: 'osm',
  transport: 'osm',
  rent: 'user',
  on_site: 'siteVisit',
};

/*
 * Fig. 1 on the landing page: a hand-drawn street plan (SVG user units, 400 × 300).
 * Fictional geometry, illustrating the same two storefronts as the example table.
 */
export const PLAN_VIEWBOX = '0 0 400 300';

const PLAN_COLUMNS: [number, number][] = [[8, 84], [100, 184], [200, 284], [300, 392]];
const PLAN_ROWS: [number, number][] = [[8, 66], [82, 144], [162, 226], [242, 292]];

export const PLAN_BLOCKS = PLAN_COLUMNS.flatMap(([x1, x2]) =>
  PLAN_ROWS.map(([y1, y2]) => ({ x: x1, y: y1, width: x2 - x1, height: y2 - y1 }))
);

/** The river cuts across the lower-left corner, like the Mtkvari through the city grid. */
export const PLAN_RIVER_PATH = 'M-10 212 C 40 222, 70 262, 96 300 L 60 310 C 40 280, 20 250, -10 244 Z';

export const PLAN_RADIUS = 62;

export const PLAN_SITES = [
  { letter: 'A', x: 142, y: 114 },
  { letter: 'B', x: 330, y: 196 },
] as const;

export type PlanPoint = { role: PlaceRole; x: number; y: number };

const point = (role: PlaceRole) => ([x, y]: [number, number]): PlanPoint => ({ role, x, y });

export const PLAN_POINTS: PlanPoint[] = [
  ...([[40, 30], [60, 190], [236, 34], [250, 268], [378, 96], [214, 120], [30, 120]] as [number, number][]).map(point('context')),
  ...([[312, 214], [348, 182], [360, 214], [318, 242], [340, 166], [372, 200], [300, 176]] as [number, number][]).map(point('context')),
  ...([[126, 92], [150, 98], [114, 120], [172, 106], [322, 178]] as [number, number][]).map(point('activity')),
  ...([[112, 100], [168, 90], [160, 138], [122, 136], [184, 124], [352, 238]] as [number, number][]).map(point('competitor')),
];

/** Bus stops sit on street corners; drawn as small squares. */
export const PLAN_STOPS: [number, number][] = [[92, 153], [192, 153], [192, 74], [292, 234]];
