# 010 — Candidate locations: save / list / delete

**Phase:** 1 · **Depends on:** 009 · **Status:** done

## Tasks
- [x] `features/locations/schema/candidate-location.schema.ts` — `userId`, `label`, `address`,
      `businessType`, `radiusM`, `location` (Point), `rentGel?`, `observations[]`, `score?` (snapshot), timestamps.
- [x] Repository: `create`, `findByUser`, `deleteByIdForUser` (both scoped by `userId`).
- [x] Service + validations (`CreateLocationSchema`, label 1–80 chars).
- [x] Routes: `GET/POST /api/locations`, `DELETE /api/locations/[id]` — `userId` from `auth()`, never the client.
- [x] "Save location" form in the explorer panel.

## Acceptance criteria
- A user can only see/delete their own locations (service spec).
