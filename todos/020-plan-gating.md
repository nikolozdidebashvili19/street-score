# 020 — Plan gating & usage limits

**Phase:** 3 · **Depends on:** 019 · **Status:** todo

## Tasks
- [ ] Limits const: free = N nearby searches/day, 3 saved locations, 1 sample report; pro = unlimited.
- [ ] Usage counter collection; checks in services (server-side, plan read from DB, never from the client).
- [ ] Upgrade prompts in the UI when a limit is hit (402 `PLAN_LIMIT`).
