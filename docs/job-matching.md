# CVPower — Job Matching Engine (high-level design)

## Purpose
Turn a raw job description into structured requirements, then map each requirement to evidence in the resume — producing a matched / partially-matched / missing breakdown that drives both the score and the recommendations. Pure client-side TypeScript (`lib/matching`), no LLM.

## Pipeline
1. **Parse the JD** into sections (responsibilities, requirements, nice-to-haves) using heading and list heuristics.
2. **Extract requirements**: hard skills, soft skills, tools/technologies, qualifications, seniority signals, and years-of-experience hints. Multi-word terms handled via n-grams.
3. **Weight requirements**: "required"/"must" > "preferred"/"nice to have"; frequency and section boost importance.
4. **Match against the resume** using the taxonomy: exact, synonym, and stem matching, with partial credit for adjacent skills (e.g. "React" partially satisfies "front-end frameworks").
5. **Classify** each requirement as `matched`, `partial`, or `missing`, attaching the resume evidence (which section/bullet) or the gap.

## <a id="taxonomy"></a>Skills taxonomy
A curated, versioned dictionary in `lib/taxonomy`:
- **Canonical skills** with **synonyms/aliases** ("js" ↔ "javascript", "postgres" ↔ "postgresql").
- **Categories** (languages, frameworks, cloud, soft skills, tools).
- **Relatedness** links for partial-credit matching.

The taxonomy is data, not code — reviewable, extendable via PR, and community-maintainable. It is the single most important asset for match quality and is where contributions have the highest leverage.

## Output model
A `MatchResult` = list of `RequirementMatch` items (requirement, weight, status, evidence/gap) + aggregate coverage figures the scoring engine consumes. The gaps become the [recommendations](scoring-engine.md#explainability-contract).

## Quality strategy
Because it's rule-based, correctness is testable with fixtures: a corpus of real JD/resume pairs with expected matches. The taxonomy and heuristics improve iteratively against this corpus. No black box — every match is inspectable.

## Not doing
No hosted embedding/semantic API, no auto-rewriting of the resume, no data leaving the device.
