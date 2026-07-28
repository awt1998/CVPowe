# Changelog

All notable changes to CVPower are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **i18n startup crash:** removed `hasLocale` (a next-intl **v4-only** export) which
  broke the app on the installed next-intl v3. Locale validation now uses a local
  `isValidLocale` type guard, and the root layout loads messages via `getMessages()`
  and passes them explicitly to `NextIntlClientProvider`.

### Security
- Upgraded **Next.js 15.3.0 → 15.5.21** (July 2026 security release) and
  `eslint-config-next` to match.
- Upgraded dev tooling (`vitest` → v3, `@vitejs/plugin-react`) to drop transitively
  flagged `esbuild`/`vite` versions.
- Run `npm audit` after install; use `npm audit fix` for any remaining transitive
  advisories.

### Milestone 1 — Foundation & Design System
- Initialized Next.js 15 + React 19 + TypeScript project.
- Configured Tailwind CSS design tokens (light/dark) and shadcn/ui.
- Set up `next-intl` locale routing with English + Arabic (RTL) support.
- Added `next-themes` theming and app providers.
- Built the reusable UI component library (button, card, input, textarea, label,
  badge, separator, progress, skeleton, switch, tabs, dialog, tooltip,
  dropdown-menu, sheet, toast).
- Added brand components (logo, privacy badge) and layout shell (header, footer).
- Authored planning docs under `docs/` and repo hygiene (CI, issue/PR templates).

[Unreleased]: https://github.com/awt1998/CVPower/commits/main
