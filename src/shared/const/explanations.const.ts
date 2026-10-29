export const ADVANTAGE_THRESHOLD = 70;
export const RISK_THRESHOLD = 40;

/** Always-on checklist items for businesses; their text lives in the dictionaries under `explain.baseline`. */
export const BASELINE_VERIFY_KEYS = ['footTraffic', 'competitors', 'lease', 'permits'] as const;

/** Real estate checklist: the things map data cannot tell you about a plot or building. */
export const PROPERTY_VERIFY_KEYS = ['zoning', 'ownership', 'prices', 'utilities'] as const;

export type BaselineVerifyKey = (typeof BASELINE_VERIFY_KEYS)[number] | (typeof PROPERTY_VERIFY_KEYS)[number];
