# CVPower — Scoring Engine (high-level design)

## Purpose
Produce an **explainable** 0–100 match score between a resume and a specific job description, plus sub-scores and the evidence behind each. The engine is a pure, deterministic, client-side TypeScript module (`lib/scoring`) — no LLM, no network. Transparency is the product: every point must be traceable to a reason.

## Inputs / outputs
- **Input:** the structured `Resume` model + the `JobDescription` model (with extracted requirements from the [matching engine](job-matching.md)).
- **Output:** a `ScoreResult` = overall score, a set of weighted `SubScore`s, and a list of `ScoreReason`s (what helped, what hurt) that feed the recommendations UI.

## Sub-scores (weighted composite)
The overall score is a weighted sum of independent dimensions. Indicative weights (tunable, versioned):

| Sub-score | Weight | What it measures |
| --- | --- | --- |
| Keyword coverage | 30% | Share of the JD's important keywords present in the resume. |
| Skills match | 25% | Required/preferred skills matched (incl. synonyms) vs missing. |
| ATS-friendliness | 15% | Structural parseability (no tables/columns/images, standard sections, clean dates). |
| Quantification | 12% | Proportion of experience bullets with concrete metrics/impact. |
| Relevant experience | 10% | Title/seniority alignment and recency of relevant roles. |
| Readability & length | 8% | Reading level, bullet density, page-count sanity. |

Weights live in a single versioned config so scoring is transparent and reproducible; changing them bumps a `scoringVersion`.

## Method (deterministic NLP, no LLM)
1. **Normalize** both documents: lowercase, strip punctuation, tokenize, lemmatize with a lightweight rule set, remove stopwords.
2. **Extract keywords** from the JD by frequency + a curated importance weighting (skills/tools/verbs rank higher than filler), using the skills [taxonomy](job-matching.md#taxonomy) and n-gram detection for multi-word terms ("react native", "project management").
3. **Match** resume tokens against JD keywords using exact, synonym, and stem matching; partial credit for related terms.
4. **Score each dimension** independently as a 0–1 ratio, then apply weights.
5. **Explain**: for every dimension, emit the specific hits/misses so the UI can render "Add `Kubernetes`" or "Quantify this bullet" with an estimated point impact.

## Explainability contract
No score without a reason. Each `ScoreReason` carries: dimension, severity, human-readable message, the evidence (matched/missing term or bullet id), and an estimated `impact` (points recoverable). Recommendations are just reasons sorted by impact and de-duplicated.

## Performance
Pure functions, memoized on input hashes. Runs in a Web Worker for large inputs. Target < 300 ms typical. Fully unit-tested (target ≥ 90% coverage) because determinism makes it straightforward.

## Explicitly not doing
No semantic embeddings from a hosted model, no generated prose, no phone-home. If a future local/WASM model is ever added, it must ship in-bundle and keep the on-device guarantee.
