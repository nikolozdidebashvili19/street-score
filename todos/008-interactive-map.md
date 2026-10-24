# 008 — Interactive map (MapLibre + OpenFreeMap)

**Phase:** 1 · **Depends on:** 002 · **Status:** done

## Tasks
- [x] Install `maplibre-gl`.
- [x] `features/explorer/components/explorer-map.tsx` (client) — OpenFreeMap style
      (`https://tiles.openfreemap.org/styles/positron`), centred on Tbilisi.
- [x] Click to drop a pin → updates the explorer store `pin`.
- [x] Renders nearby places as a GeoJSON circle layer coloured by role (competitor vs relevant)
      and a radius circle around the pin.
- [x] Attribution: "© OpenStreetMap contributors (ODbL) · OpenFreeMap".
- [x] Map constants in `src/shared/const/map.const.ts`.

## Acceptance criteria
- Map loads without an API key; pin + markers render; attribution visible.
