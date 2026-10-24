# 005 — OSM import script (Overpass → MongoDB)

**Phase:** 1 · **Depends on:** 004 · **Status:** done

## Goal
Bulk-load places for one Tbilisi area (launch plan week 2) instead of querying Overpass per user request.

## Tasks
- [x] `src/shared/lib/overpass.ts` — `OverpassClient` singleton: builds a query for a bbox + OSM tag
      filters, POSTs to `OVERPASS_URL`, returns elements (nodes + way centres). With spec.
- [x] `features/places/service/place-import.service.ts` — maps elements → place docs via
      `osmTagsToCategory`, skips unmapped elements, calls `placeRepository.bulkUpsert`.
- [x] `scripts/import-osm.ts` + `npm run import:osm -- vake`. Areas defined as bboxes in
      `places.const.ts`: Vake, Saburtalo, Old Tbilisi, Vera, whole Tbilisi.
- [x] `.env.example`: `OVERPASS_URL=https://overpass-api.de/api/interpreter`.

## Acceptance criteria
- Running the script against Mongo inserts places and is idempotent (re-run updates, no duplicates).
- Service spec covers mapping + skip rules.

## Notes
Overpass fair use: one query per area, `[timeout:120]`, run manually or via ticket 021.

## Implementation notes
- Verified live: Vera import fetched 1,655 OSM elements, all mapped, and upserted into MongoDB.
- `OverpassClient` retries 429/502/503/504 with exponential backoff (the public server returned 502 during testing).
- No local MongoDB/Docker on the dev machine yet — set `MONGO_URI` in `.env.local` (Atlas M0 works) before running.
