# CVPower — UI & Design System

## Philosophy
Minimal, elegant, premium, fast. Inspired by Apple, Linear, Notion, Stripe, and Vercel. Whitespace and typography do the work; decoration is minimized. User experience comes before ornamentation, and no animation exists without a functional reason.

## Design tokens
Defined as HSL channels in `src/app/globals.css` and consumed through the Tailwind config. Light is default; `.dark` is toggled on `<html>` by `next-themes`.

| Token | Role |
| --- | --- |
| `--background` / `--foreground` | Page surface / primary text |
| `--card`, `--popover` | Raised surfaces |
| `--primary` | Brand action (indigo) |
| `--secondary`, `--muted`, `--accent` | Neutral fills and subdued text |
| `--success`, `--warning`, `--destructive` | Score/status semantics |
| `--border`, `--input`, `--ring` | Lines and focus |
| `--radius` | Corner radius base (0.75rem) |

Semantic color usage maps to product meaning: `success` = strong match / resolved issue, `warning` = partial match / needs attention, `destructive` = missing requirement / ATS blocker.

## Typography
`Inter` for UI/body via `next/font` (CSS var `--font-sans`), `JetBrains Mono` for code/metrics (`--font-mono`). Tight tracking on large headings, balanced text wrapping (`text-balance`) for hero and card copy.

## Spacing & layout
6-based spacing scale (Tailwind default), a centered `Container` at max-width 6xl with 1.5rem gutters, generous vertical rhythm. Cards use `shadow-xs`/`shadow-soft` for a calm, premium depth rather than heavy borders.

## Component library (Milestone 1)
Reusable primitives in `src/components/ui`, built on Radix + CVA:
button, card, input, textarea, label, badge, separator, progress, skeleton, switch, tabs, dialog, sheet, tooltip, dropdown-menu, toast (sonner).

Brand/layout: `Logo`, `PrivacyBadge`, `Container`, `SiteHeader`, `SiteFooter`, `ThemeToggle`, `LocaleSwitcher`.

All primitives: forward refs, accept `className`, use `cn()` for conflict-safe merging, expose variants via CVA, and are keyboard/screen-reader accessible.

## Theming
`next-themes` with `attribute="class"`, system default, no transition flash. Every token has a light and dark value; components never hard-code colors.

## RTL
`dir` is set on `<html>` from the active locale (`ar` → `rtl`). Components use logical properties and RTL-aware utilities (`start`/`end`, `ms`/`me`, `rtl:` variants). Directional icons (arrows, switch thumb, slide-in sheets) flip under RTL. Arabic must be tested explicitly, including PDF export.

## Motion
Framer Motion for meaningful transitions only (score reveal, step changes). Respect `prefers-reduced-motion`. Default durations 200–300ms, ease-out.

## Accessibility checklist (per component)
Keyboard operable · visible focus ring · correct roles/labels · adequate contrast in both themes · RTL-safe · reduced-motion-safe.
