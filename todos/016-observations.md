# 016 — Site-visit observations & rent input

**Phase:** 2 · **Depends on:** 010, 013 · **Status:** todo

## Tasks
- [ ] Observation types: `pedestrian_count` (per 15 min, with time of day), `visibility` (1–5),
      `opening_hours_note`, `free_text`; plus `rentGel` and `budgetGel` on the location.
- [ ] `POST /api/locations/[id]/observations` (append) + form on a location detail view.
- [ ] Scoring: `on_site` factor uses observations; `rent` factor uses rent vs the user's budget.
- [ ] Rent economics: monthly rent ÷ average ticket = customers/month needed to cover rent.
