# 003 — Business categories & OSM tag mapping

**Phase:** 1 · **Depends on:** — · **Status:** done

## Goal
One source of truth for: which business types StreetPulse supports, which OSM tags map to which
internal place category, and which nearby places matter for each business type.

## Tasks
- [x] `src/shared/const/places.const.ts`
  - `PLACE_CATEGORIES`: internal categories (`cafe`, `restaurant`, `hairdresser`, `beauty`, `gym`,
    `clothes`, `convenience`, `bus_stop`, `metro_station`, `school`, `university`, `office`,
    `residential`, `bank`, `pharmacy`, …) with EN/KA labels, the OSM tag(s) that produce them, and a
    `group` (`business` · `transport` · `education` · `workplace` · `residential`).
  - `BUSINESS_TYPES`: MVP types `cafe`, `salon`, `retail`, `gym` → `competitorCategories`,
    `activityCategories` (demand generators), `defaultRadiusM`.
- [x] `src/shared/utils/osm.ts` — `osmTagsToCategory(tags)` + `.spec.ts`.

## Acceptance criteria
- Unit tests cover tag → category mapping, including unknown tags → `null`.

## Update — 14 business types
- Business types moved to `src/shared/const/business-types.const.ts` and grouped (food, health, retail, education):
  café, restaurant, fast food, bakery, bar, salon, gym, pharmacy, dental clinic, clothing retail,
  grocery, florist, pet shop / vet, private kindergarten. Each has its own profile in `scoring.const.ts`.
- New place categories: `bakery`, `dentist` (split out of `healthcare`), `florist`, `pet` (incl. veterinary).
- Re-imported Tbilisi: 29,306 places. New profiles are uncalibrated hypotheses — see ticket 023.
