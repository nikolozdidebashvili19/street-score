# StreetPulse — Implementation Tickets

Step-by-step build plan derived from [PRODUCT.md](../PRODUCT.md). Tickets are ordered; each one
builds on the ones before it. Every ticket must follow the architecture rules in
[CLAUDE.md](../CLAUDE.md) (feature folders, `ServiceResult`, thin routes, repositories with
`mongo.connect()`, no inline styles, no arbitrary Tailwind values, `type` not `interface`).

Status values: `todo` · `in-progress` · `done` · `blocked`

## Phase 0 — Foundation
| # | Ticket | Status |
|---|---|---|
| 001 | [Rebrand template to StreetPulse](001-rebrand-streetpulse.md) | done |
| 002 | [Open the app shell to all signed-in users](002-app-shell-access.md) | done |

## Phase 1 — Location Explorer (Tier 1)
| # | Ticket | Status |
|---|---|---|
| 003 | [Business categories & OSM tag mapping](003-business-categories.md) | done |
| 004 | [Places schema, 2dsphere index & repository](004-places-schema.md) | done |
| 005 | [OSM import script (Overpass → MongoDB)](005-osm-import.md) | done |
| 006 | [Nearby places API](006-nearby-places-api.md) | done |
| 007 | [Geocoding with cache (Nominatim)](007-geocoding.md) | done |
| 008 | [Interactive map (MapLibre + OpenFreeMap)](008-interactive-map.md) | done |
| 009 | [Explorer panel: search, category, radius, nearby list](009-explorer-panel.md) | done |
| 010 | [Candidate locations: save / list / delete](010-candidate-locations.md) | done |
| 011 | [Saved locations page](011-saved-locations-page.md) | done |
| 012 | [Compare 2–3 locations side by side](012-compare-locations.md) | done |

## Phase 2 — Intelligence Engine (Tier 2)
| # | Ticket | Status |
|---|---|---|
| 013 | [Deterministic scoring engine](013-scoring-engine.md) | done |
| 014 | [Score API & breakdown UI](014-score-breakdown-ui.md) | done |
| 015 | [Template-based explanations & verify checklist](015-explanations.md) | done |
| 016 | [Site-visit observations & rent input](016-observations.md) | todo |
| 017 | [Competitor concentration & underserved areas](017-competitor-concentration.md) | todo |
| 023 | [Calibrate scoring targets on real Tbilisi data](023-calibrate-scoring.md) | todo |

## Phase 3 — Business Reports & Billing (Tier 3)
| # | Ticket | Status |
|---|---|---|
| 018 | [PDF report generation](018-pdf-report.md) | todo |
| 019 | [Billing fields, Dodo checkout & webhook](019-billing-dodo.md) | todo |
| 020 | [Plan gating & usage limits](020-plan-gating.md) | todo |
| 021 | [Scheduled OSM refresh (GitHub Actions)](021-scheduled-refresh.md) | todo |
| 022 | [Georgian language support (ka)](022-georgian-i18n.md) | done |

## Non-negotiable product rules (apply to every ticket)
1. Scores are deterministic: `S = Σ(wᵢ·sᵢ) / Σ(wᵢ)` over factors **with data**. No AI-invented numbers.
2. Every factor shows its source and a confidence level; missing factors are flagged, not guessed.
3. A score is "fit to your criteria", never "probability of success" — say so in the UI.
4. OSM data needs ODbL attribution wherever it is shown (map, reports).
5. Never claim competitor coverage is complete.
6. Respect Nominatim / Overpass fair use: bulk import + cache, never per-request fan-out.
