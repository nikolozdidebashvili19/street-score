# 013 — Deterministic scoring engine

**Phase:** 2 · **Depends on:** 003 · **Status:** done

## Goal
A transparent, testable score. Pure functions — no DB, no AI.

## Tasks
- [x] `src/shared/const/scoring.const.ts` — per business type: factor weights (café example from
      PRODUCT.md §4) and normalization targets (e.g. "≥ 15 relevant places within radius = 100").
- [x] `features/scoring/types/scoring.types.ts` — `ScoreFactor { key, label, weight, value (0–100) | null,
      source, confidence: 'high' | 'medium' | 'low' | 'none', evidence }`, `LocationScore { total, coverage, factors }`.
- [x] `features/scoring/service/scoring.service.ts`
  - `computeFactors(input)` — relevant activity, competitor pressure (inverse), surroundings
    (residential/workplace), transport, rent vs budget (null if not given), on-site observations (null if none).
  - `computeScore(factors)` — `Σ(w·s)/Σ(w)` over non-null factors; `coverage = Σw(with data) / Σw(all)`.
- [x] Exhaustive spec: formula, missing-data exclusion, clamping 0–100, determinism.

## Acceptance criteria
- Same input → same output. A missing factor never counts as 0; it is excluded and flagged.
