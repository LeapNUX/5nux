# Credits

BranchNuX stands on the shoulders of prior work — most significantly gstack. This document names the sources, describes what was borrowed, and explains how to credit BranchNuX in your own work.

---

## gstack — the foundation

**Repository:** https://github.com/garrytan/gstack  
**Author:** Garry Tan  
**License:** OSS (see repo)

BranchNuX's discipline, methodology, and structural patterns derive directly from gstack. gstack is a solo-builder OSS framework that defines how to reason about software development in a structured, AI-accelerated way. Without gstack's prior work, BranchNuX would not exist in its current form.

**Specific gstack ideas BranchNuX builds on:**

| gstack idea | How BranchNuX uses it |
|---|---|
| `/plan-ceo-review`, `/plan-eng-review` | The "plan before build" discipline — BranchNuX scaffolds plans before specs |
| `/browse` (isolated Playwright Chromium) | Headless browser for QA pipelines; hybrid browser policy for auth flows |
| Memory + sprint-log + testing-log three-track structure | BranchNuX's `requirements/` + `sprint-log/` + `testing-log/` is a direct adoption |
| Multi-agent dispatch pattern | v0.2 batch agents (discover/plan/codify/enrich) follow gstack's parallel-dispatch model |
| DCO contributor convention | BranchNuX requires `git commit -s` sign-off, following gstack's contributor convention |
| Marker-comment audit trail | The `[VERIFY]` marker on every LLM-generated cell follows gstack's "human must attest AI output" principle |
| Slash-command pattern | `/qa`, `/browse`, `/design-review` integration in BranchNuX's recommended workflow |

The three-track discipline deserves specific credit: the idea that `requirements/` (what you said you'd build), `sprint-log/` (what was built), and `testing-log/` (what was tested) should be separate, date-indexed, git-native tracks — that is a gstack pattern. BranchNuX codifies it into a CLI and artifact pipeline, but the intellectual origin is gstack.

---

## Other shoulders

**Apex Dashboard**  
The demo target used in BranchNuX's example outputs. A Next.js admin dashboard used as a representative SPA for demonstrating test plan generation and HTML report output.

**NIST OSCAL**  
The Open Security Controls Assessment Language. BranchNuX's v0.2 OSCAL export targets the assessment-results and component-definition layers of NIST SP 800-18/800-53 OSCAL schemas. NIST work is in the public domain.

**IBM Trestle**  
Python library for OSCAL document management and validation. BranchNuX's optional extended OSCAL validation path uses Trestle. Apache 2.0 licensed.  
Repository: https://github.com/IBM/compliance-trestle

**Anthropic Claude**  
The LLM engine behind v0.2 agents. BranchNuX is not affiliated with Anthropic. Claude API usage is governed by Anthropic's usage policies and terms of service.  
Website: https://anthropic.com

**Playwright**  
Microsoft's end-to-end testing framework. The evidence-capture engine for per-TC screenshots. Apache 2.0 licensed.  
Website: https://playwright.dev

**Apache Software Foundation**  
BranchNuX is released under the Apache License 2.0. The Apache 2.0 license framework, NOTICE file convention, and contributor governance patterns are ASF contributions to the OSS ecosystem.  
Website: https://apache.org

---

## How to credit BranchNuX in your work

If BranchNuX is part of your regulated compliance workflow, your audit package, or your published methodology:

1. **Preserve `LICENSE` and `NOTICE`** — the Apache 2.0 license requires you to include the license and NOTICE file when distributing or bundling BranchNuX.

2. **Trademark restriction** — "BranchNuX™" is a trademark of Chu Ling. You may describe your use of the software ("we use BranchNuX for evidence generation") but may not use the name in a way that implies endorsement, affiliation, or that your product is BranchNuX.

3. **Link to the repository** — https://github.com/StillNotBald/branchnux (or the canonical URL at time of your publication)

4. **Sign commits per DCO** — if you contribute back to BranchNuX, all commits must be signed off with `git commit -s`. No CLA required. The DCO sign-off is your legal attestation that you have the right to contribute the code.

### Optional citation format

For academic papers, audit reports, or methodology documentation that references BranchNuX:

```
Methodology powered by BranchNuX (Apache 2.0, github.com/StillNotBald/branchnux)
and gstack (github.com/garrytan/gstack).
```

If citing only one, cite both. BranchNuX's methodology is not separable from gstack's foundation.

---

## What is not claimed

BranchNuX does not claim to have invented:

- The three-track requirements / sprint-log / testing-log structure (gstack)
- The multi-agent dispatch workflow (gstack)
- OSCAL as a standard (NIST)
- The `[VERIFY]` marker concept in AI-assisted compliance (gstack convention)
- Playwright's evidence capture model

What BranchNuX adds: a deterministic CLI pipeline that turns the above patterns into reproducible, auditor-ready artifact packages without requiring manual assembly.
