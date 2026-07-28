# CVPower — Project Rules (source of truth for constraints)

These rules are binding. They exist to protect the two things that make CVPower different: **privacy by architecture** and **free forever**.

## Hard constraints
- **No backend.**
- **No database.**
- **No authentication.**
- **No paid APIs.** No OpenAI, Gemini, or Claude API. No hosted inference of any kind.
- **No Firebase / Supabase.**
- Everything runs entirely in the browser.
- All user data stays on the user's device via LocalStorage.
- Privacy is a headline feature — nothing is transmitted, nothing is tracked.
- **Free forever.** No paywalls, no gated features.

## Tech stack (fixed)
Next.js 15 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Zustand · React Hook Form · Zod · next-intl · Lucide Icons.

## Design philosophy
Minimal, elegant, premium, professional, fast, modern. Inspired by Apple, Linear, Notion, Stripe, Vercel. No visual clutter, no gratuitous animation. Whitespace and typography matter. UX before decoration.

## Mission test
Every feature must help people **get jobs** — not merely create resumes. If a feature doesn't improve resume quality or increase interview odds, it's out of scope.

## Quality bar
- Never generate demo code, placeholder implementations, or fake logic.
- Every implementation is production-ready.
- Think before writing code; explain architectural decisions when they matter.
- Keep the project scalable, components reusable, folders clean, no duplication.
- Prioritize maintainability, performance, accessibility, and clean architecture.

## Workflow
- Never build everything at once. Divide into milestones; finish one before the next.
- At the start of every milestone: explain the **goal**, the **architecture**, and the **implementation plan** — then code.
- If a better engineering solution exists than what was requested, propose it with reasoning.

## Bottom line
Build something that looks and feels like a premium commercial product — while being completely free and completely private.
