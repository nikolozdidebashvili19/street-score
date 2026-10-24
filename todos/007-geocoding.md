# 007 — Geocoding with cache (Nominatim)

**Phase:** 1 · **Depends on:** — · **Status:** done

## Tasks
- [x] `src/shared/lib/nominatim.ts` — `NominatimClient` singleton: `search(query)` limited to Georgia
      (`countrycodes=ge`, `accept-language=ka,en`), identifying `User-Agent`, ≥1 s between calls. Spec.
- [x] `features/geocoding/schema/geocode-cache.schema.ts` — `query` (normalized, unique), `results`, 30-day TTL.
- [x] `features/geocoding/repository` + `service` — cache-first lookup.
- [x] `POST /api/geocode` `{ query }` → `[{ label, lng, lat }]`.
- [x] `.env.example`: `NOMINATIM_URL`, `NOMINATIM_USER_AGENT`.

## Acceptance criteria
- The same query twice hits Nominatim once (service spec with mocked client + repo).
