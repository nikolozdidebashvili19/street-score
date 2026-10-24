export const ADVANTAGE_THRESHOLD = 70;
export const RISK_THRESHOLD = 40;

/** Always-on checklist items; their text lives in the dictionaries under `explain.baseline`. */
export const BASELINE_VERIFY_KEYS = ['footTraffic', 'competitors', 'lease', 'permits'] as const;

export type BaselineVerifyKey = (typeof BASELINE_VERIFY_KEYS)[number];
