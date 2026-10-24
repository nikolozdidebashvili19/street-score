# 021 — Scheduled OSM refresh (GitHub Actions)

**Phase:** 3 · **Depends on:** 005 · **Status:** todo

## Tasks
- [ ] `.github/workflows/refresh-osm.yml` — weekly cron running `npm run import:osm -- tbilisi`
      with a `MONGO_URI` secret.
- [ ] Mark places not seen in the latest import as `stale` instead of deleting them (competitor-change tracking).
