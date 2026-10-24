# 012 — Compare 2–3 locations side by side

**Phase:** 1 · **Depends on:** 011, 014 · **Status:** done

## Tasks
- [ ] ~~`POST /api/locations/compare`~~ (not needed yet — see notes) `{ ids: string[2..3] }` → each location + nearby summary + score.
- [x] `/compare` page: one column per location — total score, factor rows (with "no data" flags),
      competitor count within radius, top advantage / top risk, "what to verify".
- [x] Disclaimer: "Neither is automatically the better investment" (PRODUCT.md §2).

## Acceptance criteria
- Reproduces the Location A vs B layout from PRODUCT.md with real computed data.

## Implementation notes
- Implemented without a separate compare API: `/compare?ids=…` reads the user's saved locations
  (each stores a server-computed score snapshot) and renders them side by side with explanations.
- Add `POST /api/locations/compare` later only if fresh re-scoring at compare time is needed.
