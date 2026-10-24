# 023 — Calibrate scoring targets on real Tbilisi data

**Phase:** 2 · **Depends on:** 005, 013 · **Status:** todo

## Why
First live run (Vera, 500 m, café, real OSM import of 1,655 places) produced:
`activity=100, competition=0, surroundings=100, transport=100` → 66 cafés mapped within 500 m.
The starting targets in `src/shared/const/scoring.const.ts` saturate in dense central districts, so
two central candidate sites would score almost the same. A score that can't tell sites apart isn't useful.

## Tasks
- [ ] Import all of Tbilisi (`npm run import:osm -- tbilisi`) and compute per-factor raw-count
      distributions over a grid of sample points (e.g. every 250 m) for each business type.
- [ ] Re-derive targets from percentiles (e.g. target = p90 of raw counts) instead of guesses.
- [ ] Consider a smaller default radius for cafés (250–300 m) — walk-in catchment is short.
- [ ] Consider competitor pressure relative to demand (competitors ÷ demand drivers) rather than absolute count.
- [ ] Keep it deterministic and documented; re-run `scoring.service.spec.ts` and update expectations.
- [ ] Validate against the week-3 site visits (PRODUCT.md §8) and expert feedback.
