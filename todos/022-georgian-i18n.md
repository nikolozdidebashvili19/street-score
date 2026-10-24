# 022 — Georgian language support (ka)

**Phase:** 3 · **Depends on:** 009, 015 · **Status:** done

## Tasks
- [x] Locale switch (EN/KA) in the header; choice stored in the `sp-locale` cookie, falling back to the
      browser's Accept-Language. `<html lang>` and metadata follow the locale.
- [x] All UI strings in typed dictionaries (`src/shared/const/dictionary-{en,ka}[-app].const.ts`);
      a spec checks Georgian has every English key and matching placeholders.
- [x] Score evidence and explanations stored as keys + numeric params, rendered per language
      (older snapshots fall back to their stored English text).
- [x] Validation messages are dictionary keys translated by `FormMessage`; API error codes translated in hooks.
- [x] Georgian font: Noto Sans Georgian as fallback in the sans/heading/mono stacks; uppercase eyebrows
      are not transformed to Mtavruli for `lang="ka"`.
- [x] Place and business-type names in Georgian (`labelKa`).
- [ ] PDF reports in both languages (with ticket 018).

## Notes
- Georgian copy was written by Claude (AI), not a professional translator — have a native speaker review
  `dictionary-ka*.const.ts` before launch.
- Address search results come from Nominatim in Georgian regardless of UI language.
