# CVPower — Architecture

## 1. Principles in code
Everything runs in the browser. There is no server, no database, no auth, and no external API. The app is a Next.js 15 App Router project that behaves like a static single-page-ish app: pages are locale-scoped and rendered without server data, and all "intelligence" (scoring, matching, PDF) is pure client-side TypeScript.

## 2. High-level layers
```
┌──────────────────────────────────────────────────────────┐
│ Presentation      app/[locale]/**, components/ui, brand, │
│                   layout, common                         │
├──────────────────────────────────────────────────────────┤
│ Feature modules   components/<feature>/ + hooks          │
│                   (builder, analyze, export, templates)  │
├──────────────────────────────────────────────────────────┤
│ State             stores/ (Zustand, persisted)           │
├──────────────────────────────────────────────────────────┤
│ Domain engines    lib/scoring, lib/matching, lib/pdf,    │
│                   lib/parsing, lib/taxonomy              │
├──────────────────────────────────────────────────────────┤
│ Persistence       lib/storage (LocalStorage + schema     │
│                   versioning + migrations)               │
└──────────────────────────────────────────────────────────┘
```
Dependencies point downward only. Presentation never touches storage directly; it goes through stores. Engines are pure functions with no React and no storage dependency, which makes them trivially testable.

## 3. Folder structure
The full target layout (feature folders are created as their milestones land):

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx          # root html/body, providers, header/footer
│       ├── page.tsx            # landing
│       ├── builder/            # resume editor (M2)
│       ├── analyze/            # scoring + matching results (M3–M4)
│       ├── templates/          # template gallery (M5)
│       ├── privacy/            # privacy explainer + wipe control
│       └── not-found.tsx
├── components/
│   ├── ui/                     # shadcn primitives (M1)
│   ├── brand/                  # logo, privacy-badge
│   ├── layout/                 # container, site-header, site-footer
│   ├── common/                 # theme-toggle, locale-switcher, shared atoms
│   ├── builder/                # resume-form sections (M2)
│   ├── analyze/                # score-ring, gap-list, recommendation-card (M3–M4)
│   └── export/                 # template renderers, export dialog (M5)
├── stores/                     # zustand stores (M2+)
├── lib/
│   ├── utils.ts
│   ├── storage/                # persistence + migrations (M2)
│   ├── parsing/                # pdf.js / mammoth adapters (M2)
│   ├── taxonomy/               # skills dictionary + synonyms (M3)
│   ├── matching/               # job-matching engine (M4)
│   ├── scoring/                # scoring engine (M3)
│   └── pdf/                    # pdf export engine (M5)
├── hooks/
├── i18n/                       # next-intl routing/request/navigation
├── config/                     # site metadata
└── types/                      # shared TS types (defined in Milestone 2)
messages/                       # en.json, ar.json
```

## 4. State architecture (Zustand)
Four persisted stores plus one transient store. Each store owns a slice; cross-store reads happen via selectors, never by merging state.

| Store | Persisted | Responsibility |
| --- | --- | --- |
| `resumeStore` | ✅ | Resume profiles, the active resume, section CRUD. |
| `jobStore` | ✅ | Current + saved job descriptions and their extracted requirements. |
| `analysisStore` | ✅ (cache only) | Latest scoring/matching results, memoized; recomputed when inputs change. |
| `settingsStore` | ✅ | Locale, theme, active template, privacy flags. |
| `uiStore` | ❌ | Modals, toasts, wizard step, transient flags. |

**Derived-not-duplicated:** analysis results are a pure function of `activeResume + currentJob`. A selector triggers recomputation when either changes; results are cached in `analysisStore` for display but are never a second source of truth.

### Lifecycle per analysis view
`empty` (no resume/job) → `editing` → `analyzing` (engine running, possibly in a Web Worker) → `analyzed` → `exporting`. Every state has an explicit render; there are no placeholder-only paths.

## 5. Persistence & storage schema
- **Mechanism:** `localStorage`, wrapped by `lib/storage` with typed get/set, debounced writes, and a `schemaVersion` field.
- **Migrations:** a `migrations[]` array upgrades older payloads on load; unknown/newer versions fall back safely rather than corrupting data.
- **Namespacing:** keys prefixed `cvpower:` (e.g. `cvpower:resume`, `cvpower:settings`). A single `wipeAll()` clears every `cvpower:*` key.
- **Size discipline:** store text and structured JSON only — never binaries or embedded fonts/images. Warn the user near the ~5MB quota.
- **Backup:** export/import a single JSON blob containing all stores for manual portability between devices.

## 6. Engines (client-side, pure)
- **Scoring** — explainable 0–100 with weighted sub-scores. See [scoring-engine.md](scoring-engine.md).
- **Job matching** — maps JD requirements to resume evidence. See [job-matching.md](job-matching.md).
- **PDF export** — deterministic, ATS-safe, selectable-text output. See [pdf-export.md](pdf-export.md).
- **Parsing** — pdf.js (PDF) and mammoth (DOCX) adapters normalize uploads into the resume model; lazy-loaded so they stay out of the initial bundle.

Heavy work (scoring on large inputs, PDF generation) runs in a **Web Worker** where practical to keep the UI at 60fps.

## 7. Performance strategy
Code-split parsers and the PDF engine; `optimizePackageImports` for icons; memoized selectors; debounced persistence; virtualize long lists (keyword/gap explorer). Target: time-to-first-score < 300 ms on typical inputs; Lighthouse performance ≥ 95.

## 8. Accessibility
Radix primitives give us keyboard and screen-reader support by default. Global visible focus rings, semantic headings, `dir`-aware layout, color-contrast-safe tokens, and reduced-motion respect are mandatory.

## 9. Internationalization
`next-intl` with locale-prefixed routing (`/[locale]`), `en` + `ar`, RTL via `dir` on `<html>`. See [ui-design.md](ui-design.md#rtl) and the localization section below.

## 10. Testing
Unit (Vitest) for engines and utils — engines are pure, so coverage targets are high (≥ 90% for `lib/scoring`, `lib/matching`). Component tests (Vitest + Testing Library) for interactive UI. E2E (Playwright) for the core loop: import → analyze → export. CI runs typecheck + lint + unit + build on every PR.

## 11. Deployment
Static-friendly Next build deployed to Vercel. No environment secrets. Preview deploys per PR; production on `main`. See the deployment section in [roadmap.md](roadmap.md) and the CI workflow in `.github/workflows/ci.yml`.
