# 006 — Nearby places API

**Phase:** 1 · **Depends on:** 004 · **Status:** done

## Tasks
- [x] `features/places/validations/place.validation.ts` — `NearbyQuerySchema`
      (`lng` -180..180, `lat` -90..90, `radiusM` 50..2000, `categories?` array of known categories).
- [x] `features/places/service/place.service.ts` — `getNearbyPlacesService` → `ServiceResult<NearbyPlace[]>`.
- [x] `POST /api/places/nearby` (body validated with `validateBody`, consistent with the codebase).
- [x] Route + service specs.

## Acceptance criteria
- Invalid coordinates → 400 `VALIDATION_ERROR`.
- Results sorted by distance; each item has `distanceM`.

## Implementation notes
- Also added `placeRepository.countByCategoryNear` (`$geoNear` + `$group`) so scores use exact counts,
  not the truncated map list (see `POST /api/score`, ticket 014).
