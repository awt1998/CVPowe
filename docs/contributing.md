# Contributing to CVPower

Thanks for helping build the best free resume optimizer. Contributions of all kinds are welcome — code, the skills taxonomy, translations, docs, and bug reports.

## Ground rules
Read [project-rules.md](project-rules.md) first. The non-negotiables:
- **No backend, no database, no auth, no paid/LLM APIs.** Everything runs in the browser.
- **No user data leaves the device.** No tracking, no phone-home.
- **Free forever.** No feature gating.
- **Production-ready only.** No demo/placeholder/fake logic.

A PR that violates any of these will be closed regardless of quality.

## Getting started
```bash
git clone <your-fork>
cd cvpower
npm install
npm run dev
```
Node.js 20+ required.

## Before you open a PR
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
All must pass. Use the PR template checklist (client-side only, typed, accessible, localized EN/AR + RTL, responsive, no placeholders).

## Code style
TypeScript strict. Prettier + ESLint enforced. Components: forward refs, accept `className`, compose with `cn()`, variants via CVA, accessible by default. Keep folders clean, components reusable, no duplicated logic.

## High-leverage contributions
- **Skills taxonomy** (`lib/taxonomy`): adding canonical skills, synonyms, and relatedness directly improves match quality for everyone. This is data, reviewed via PR.
- **Translations** (`messages/*.json`): add a locale here + in `src/i18n/routing.ts`.
- **Engine test fixtures**: real JD/resume pairs (anonymized) that pin expected behavior.

## Commits & branches
Conventional commits encouraged (`feat:`, `fix:`, `docs:`, `chore:`). Branch off `main`; keep PRs focused and milestone-aligned.

## Reporting bugs / ideas
Use the issue templates. For features, explain how it helps someone get hired and confirm it works fully client-side.
