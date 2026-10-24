# 004 — Places schema, 2dsphere index & repository

**Phase:** 1 · **Depends on:** 003 · **Status:** done

## Tasks
- [x] `features/places/schema/place.schema.ts` — `osmId` (unique, e.g. `node/123`), `name`, `nameKa`,
      `category`, `location` (GeoJSON Point `[lng, lat]`), `tags` (Map of strings), `source: 'osm'`, timestamps.
      Index: `{ location: '2dsphere', category: 1 }`.
- [x] `features/places/repository/place.repository.ts`
  - `findNear({ lng, lat, radiusM, categories, limit })` via a `$geoNear` aggregation so the
    distance in metres comes back with each place.
  - `bulkUpsert(places)` via `bulkWrite` + `updateOne` upsert keyed by `osmId`.
- [x] `features/places/types/place.types.ts` — `NearbyPlace` DTO (`id, name, category, lng, lat, distanceM`).

## Acceptance criteria
- Repository spec mocks `mongo` and the model and verifies the `$geoNear` pipeline shape.
