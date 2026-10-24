export type FeatureCard = {
  key: 'explore' | 'score' | 'verify';
};

/** Card text lives in the dictionaries under `home.features.<key>`. */
export const HOME_FEATURES: FeatureCard[] = [
  { key: 'explore' },
  { key: 'score' },
  { key: 'verify' },
];

/** Rows of the PRODUCT.md §2 example; text lives under home.example. Scores are illustrative. */
export const HOME_EXAMPLE_ROWS = ['advantage', 'risk'] as const;

export const HOME_EXAMPLE_SCORES = { a: 82, b: 68 } as const;
