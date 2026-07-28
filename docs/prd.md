# CVPower — Product Requirements Document

> **Status:** Draft v1.0 · **Date:** 2026-07-29 · **Type:** Master product spec.
> Companion docs: [architecture.md](architecture.md), [scoring-engine.md](scoring-engine.md), [job-matching.md](job-matching.md), [pdf-export.md](pdf-export.md), [ui-design.md](ui-design.md), [roadmap.md](roadmap.md).

## 1. Summary
CVPower is a 100% free, privacy-first, browser-only resume optimization platform. Everything runs client-side — no backend, no database, no auth, no paid/LLM APIs. All user data lives in the browser via LocalStorage. It must feel like a premium commercial product while being open-source and free forever.

**One-sentence pitch:** Paste your resume and a job description; CVPower scores your match, tells you exactly what to fix, and exports an ATS-safe PDF — all on your device, nothing uploaded.

## 2. Problem
1. **The ATS black box** — most applications are filtered before a human sees them, and candidates don't know why.
2. **Generic resumes** — people send the same resume everywhere; tailoring is tedious and unguided.
3. **Privacy & cost** — existing tools upload resumes, gate features, or require accounts.

CVPower fixes all three: transparent scoring, guided per-job tailoring, and zero data leaving the device.

## 3. Goals / Non-Goals
**Goals:** transparent explainable match score; specific ranked fixes; ATS-safe + beautiful PDF export; 100% on-device; premium UX; open-source, free, Vercel-deployable at no server cost.

**Non-goals (v1):** no job board/scraping/auto-apply; no external-LLM text generation; no accounts/cloud sync/teams; no native mobile app (responsive web only).

## 4. Principles
No backend · no database · no auth · no paid/LLM APIs · privacy first · free forever · premium feel · production-ready only. See [project-rules.md](project-rules.md).

## 5. Personas
- **Career Switcher Sara** (primary): needs skill mapping and experience reframing.
- **New-Grad Nabil**: needs speed, ATS safety, templates that strengthen a thin resume.
- **Privacy-Conscious Priya**: uses CVPower *because* it's on-device.
- **Multilingual Marwan**: needs Arabic/English and RTL.

## 6. Core value loop
Import resume → paste job description → score & analyze → see ranked, explained gaps → apply guided fixes → re-score → export ATS-safe PDF / save version. Every feature must serve this loop.

## 7. Features

### Must-have (v1 core)
Resume import & editor (paste / upload PDF-DOCX parsed client-side / build from scratch); job-description input with requirement extraction; **scoring engine** (explainable 0–100 with sub-scores); **job-matching engine** (matched / partial / missing); ranked actionable recommendations with estimated impact; ATS analyzer; **PDF export engine** (ATS-safe, selectable text); premium ATS-safe templates; local persistence & named versions + JSON backup; localization (EN + AR) with RTL; always-visible privacy indicators + one-click wipe.

### Should-have (fast follow)
Keyword gap explorer; rule-based bullet improver (weak-verb / no-metric / passive detection using a curated library — no LLM); readability & length analysis; multiple resume profiles; cover-letter assist (structured, not generative); diff view vs base.

### Could-have (later)
Theme customization within ATS-safe limits; shareable read-only encoded-URL link (still no server); LinkedIn-export import; resume-content accessibility auditor.

### Out of scope
LLM text generation, job scraping, auto-apply, cloud accounts, phone-home analytics.

## 8. Application states
Global stores (Zustand, persisted): `resumeStore`, `jobStore`, `analysisStore`, `settingsStore`; transient `uiStore` (not persisted). Analysis is **derived** from resume + job via engines and memoized — never duplicated. Per-view lifecycle: `empty → editing → analyzing → analyzed → exporting`, each with explicit loading/error/empty renders. Persistence is debounced, schema-versioned with migrations, and fully wipeable. Full model in [architecture.md](architecture.md).

## 9. Success metrics (privacy-safe, local only)
Because nothing phones home, metrics are user-visible outcomes: score improvement from first analysis to export; ATS issues resolved; keyword-coverage % at export vs import; time-to-first-score (target < 300 ms typical). Any future analytics must be opt-in, anonymous, self-hostable, default **off**.

## 10. Risks & mitigations
Client-side parsing imperfect → battle-tested libs + manual-correction editor, never fail silently. Rule-based less "smart" than LLM → win on transparency + a well-curated skills taxonomy. Large libs hurt perf → lazy-load parsers/PDF engine. LocalStorage ~5MB limit → store text/JSON only, warn near quota. RTL + PDF complexity → RTL-capable templates, explicit Arabic export tests.

## 11. Definition of done
Production-ready (no placeholders), typed end-to-end, accessible (keyboard + screen reader), localized (EN/AR), responsive, tested per [testing strategy](architecture.md#testing), fully client-side with no network calls.
