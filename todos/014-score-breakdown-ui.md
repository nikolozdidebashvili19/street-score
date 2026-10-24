# 014 — Score API & breakdown UI

**Phase:** 2 · **Depends on:** 006, 013 · **Status:** done

## Tasks
- [x] `POST /api/score` `{ lng, lat, businessType, radiusM, rentGel?, budgetGel? }` → `LocationScore`
      (service gathers nearby places via the place repository, then calls the scoring engine).
- [x] `score-breakdown.tsx`: total + data coverage, a bar per factor with weight, source and confidence
      badges, and a "no data" state. (Recharts optional — segmented meters already match the design.)
- [x] Copy: "Fit to your criteria — not a probability of success."
- [x] Persist the score snapshot when saving a candidate location.

## Implementation notes
- Breakdown uses the design system's segmented meters instead of Recharts (no extra dependency).
- Saving a location re-scores on the server; the client never sends a score.
