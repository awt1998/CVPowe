# CVPower — PDF Export Engine (high-level design)

## Purpose
Export the structured resume into a PDF that is simultaneously **ATS-safe** (machine-parseable) and **beautiful** (human-pleasing). Fully client-side (`lib/pdf`), deterministic, no server round-trip.

## Non-negotiables
- **Selectable, real text** — never a rasterized image of the resume. ATS must extract the content.
- **Single-column, semantic structure** — standard section names, logical reading order, no tables/columns/text-in-images for content an ATS needs.
- **Embedded, licensable fonts** with correct Unicode coverage, including Arabic for RTL exports.
- **Deterministic output** — same input + template ⇒ identical PDF.

## Approach
The resume model is rendered through a chosen **template** (a pure function: `Resume → layout`) into a vector PDF with a text layer. Two candidate rendering paths, decided during Milestone 5:

1. **Direct PDF generation** (e.g. a client-side PDF library) — maximum control over the text layer and ATS structure; preferred for parseability.
2. **Print-to-PDF from a hidden, print-optimized DOM** using the browser's native engine — easiest fidelity to the on-screen template, with `@media print` CSS.

The engine abstracts templates behind a common interface so either path can back a template without changing callers. ATS-critical templates use path (1); highly designed "human" variants may use path (2) while still keeping a real text layer.

## RTL / localization
Templates are direction-aware. Arabic exports must shape and render text correctly right-to-left with an embedded Arabic font, and are covered by explicit export tests.

## ATS analyzer link
Before export, the [ATS analyzer](scoring-engine.md) warns about anything that would harm parseability. The export defaults steer users toward safe choices; "designed" templates carry an explicit ATS-risk note.

## Performance
PDF generation runs off the main thread (Web Worker) where the library allows, and the engine + fonts are lazy-loaded so they never bloat the initial bundle.

## Not doing
No server-side rendering, no upload of resume content to a PDF service, no image-only exports.
