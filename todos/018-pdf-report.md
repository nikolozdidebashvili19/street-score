# 018 — PDF report generation

**Phase:** 3 · **Depends on:** 014, 015, 016 · **Status:** todo

## Tasks
- [ ] Install `@react-pdf/renderer`; `features/reports/components/report-document.tsx`.
- [ ] Sections: summary + score, factor breakdown with sources, competitor table, advantages/risks,
      missing data, verify checklist, site observations, static map image, ODbL attribution, disclaimer.
- [ ] `reports` schema (`userId`, `locationIds`, `pdfFileId`, `createdAt`); store the PDF in GridFS.
- [ ] `POST /api/reports` (generate) + `GET /api/reports/[id]` (download, owner only).
