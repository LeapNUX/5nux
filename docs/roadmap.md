# Roadmap

> **Pacing reality:** BranchNuX is a side-project as of 2026-04-26. The 60-day decision date (2026-06-25) determines whether v0.2 ships in Q3 2026 (full-time pace) or Q4 2026 (sustainable side-project pace). Either way, v0.1 ships first; everything else flows from there.

> **Brand history:** the project shipped as `testnux` through v0.2.1, renamed to `trunknux` in v0.2.2 (2026-04-27), and renamed again to `branchnux` in v0.3.0-alpha.1 (2026-04-27). The final rename reflects the 6-NUX framework positioning: BranchNuX is the verification branch, not the trunk. See CHANGELOG for the full rename history.

---

## Strategic lanes

The product can grow in three directions. The 2026-04-27 CEO review evaluated all three and committed to **Lane B**.

### Lane A — Focused test-evidence CLI (rejected)

**What it would look like:** stay narrow on the testing wedge. Compete in the OSS test-tooling lane against TestRail / Allure / Cucumber Reports. Add more industry standards bundles, expand the eval harness, polish the existing testing surface.

**Why we rejected it:** about half the shipped product (`sign`, `sca`, `rtm`, `br`, `[VERIFY]` markers, OSCAL emission, three-track discipline) has nothing intrinsically to do with testing. Lane A would leave that machinery wasted, and a competitor with the broader thesis would eat the bigger market in 12-18 months. TAM ceiling around 5-10K regulated-fintech engineering teams, many already standardized on Vanta + Allure.

### Lane B — Regulated-content engineering (CURRENT, picked 2026-04-27)

**What it looks like:** keep the testing wedge as the public face, expand the underlying capability to cover non-testing artifact types under the same git-native + `[VERIFY]` + HMAC-chained discipline. Each new artifact verb (attest, comply, respond) produces a new fruit from the same branch. Two-way door: revert toward Lane A by pruning, advance toward Lane C if traction proves the thesis.

**Concrete shape:**

| Stage of the testing-to-audit journey | Existing commands (today) | New commands (v0.3) |
|---|---|---|
| Author and execute | `init`, `discover`, `plan`, `codify`, `enrich`, `batch-plan` | (no change) |
| Report and traceability | `report`, `rtm`, `validate` | (no change) |
| Attest and assess | `sign`, `sca`, `br` | `attest <claim>` (non-testing attestation) |
| Submit and verify | `sign pdf`, `sca oscal`, `sign stale-check` | `comply <industry>` (full compliance package), `respond <questionnaire>` (vendor-DD) |
| Per-environment + visual regression | `run`, `compare`, `visual baseline`, `visual compare` | (no change) |

**How buyers see Lane B:** the engineering lead at a regulated fintech still gets the testing wedge they wanted. The compliance officer / GRC analyst / vendor-DD lead / audit committee gets explicit recognition in the README + audience-to-artifact map. Procurement decisions made by compliance side become tractable.

**Brand:** BranchNuX (renamed from trunknux in v0.3.0-alpha.1). The 6-NUX metaphor maps directly to the lane: BranchNuX is the verification branch in the rootnux → trunknux → branchnux → leafnux → fruitnux → soilnux chain. Each new artifact verb produces a fruit; the three-track discipline (requirements/ + sprint-log/ + testing-log/) is the root system.

### Lane C — Audit-defensibility platform (12+ month aspiration)

**What it would look like:** BranchNuX becomes a category-creator. The `[VERIFY]` marker convention + HMAC-chained ledger + git-native discipline become a horizontal pattern any AI-content workflow needs (legal docs, financial reports, board governance, regulatory filings). Testing is one sample app among many. The brand grows into the Yggdrasil-scale world tree connecting every regulated content workflow.

**Why this is aspirational, not committed:**
- Category-creation requires partnerships, conference circuits, design partners at scale. Hard for a side-project to credibly drive.
- Existing OSS test-tooling community needs continuity through the transition.
- Probably 2-3 years from sustained traction in Lane B to a credible Lane C move.

**Trigger conditions for advancing toward Lane C:**
- 5+ design partners using non-testing artifact verbs (attest / comply / respond) in production.
- At least one paying enterprise contract for the attestation infrastructure (not the CLI).
- Conference or analyst recognition of the `[VERIFY]` convention as an emerging standard pattern.
- Founder full-time decision (the 60-day pacing reality at the top of this doc).

If those happen, the brand framing shifts from "verification branch" to "the world tree of regulated AI authoring" — with BranchNuX as the active verification node in a fully realized 6-NUX platform. Until then, Lane C is the long-term aspiration that informs feature decisions but doesn't drive marketing.

### How the version roadmap maps to the lanes

| Version | Lane fit | Theme |
|---|---|---|
| v0.1.x | A or B | Deterministic pipeline (testing wedge) |
| v0.2.0 | A or B | LLM agent suite + signoff suite + per-env + visual regression |
| v0.2.1 | A or B | Smoke-test polish + dependency hygiene |
| v0.2.2 | B (lane committed) | Brand rename testnux → trunknux, no functional change |
| v0.3.0-alpha.1 | B | Brand rename trunknux → branchnux (6-NUX positioning); three new artifact verbs (attest, comply, respond) |
| v0.4+ | B with C signaling | Eval harness expansion, gstack catalog skill, more industry bundles, premium tier scoping |
| v1.0 | B mature, C trigger conditions met | Stable artifact verbs, design-partner case studies, Lane C decision |

---

## Guiding principle

BranchNuX's scope follows the 8-step regulator-evidence chain:

```
1. Requirements (R-XX)           ← project owns
2. Sprint log (build)            ← git owns
3. Testing log (test plans + evidence + reports)   ← BranchNuX v0.1
4. Traceability matrix (RTM)                       ← BranchNuX v0.2
5. Security Control Assessments (SCA)              ← BranchNuX v0.2
6. UAT sign-off layer (BR-XX + e-signature)        ← BranchNuX v0.3
7. External audit / pen test     ← vendor owns
8. Production launch             ← deploy owns
```

**v0.1 owns step 3.** v0.2 extends to steps 4–5. v0.3 adds step 6.

The deterministic pipeline (markdown → HTML + XLSX) ships in v0.1 and does not require any LLM or AI service. LLM features are accelerators added in v0.2, not prerequisites for the core value.

---

## v0.1 — Current release

**Theme:** Deterministic pipeline. Author tests in markdown, get audit-ready HTML evidence in one command.

**Ships:**

| Feature | Description |
|---------|-------------|
| `branchnux init` | Scaffold a test-pass folder with templates |
| `branchnux report` | Generate self-contained HTML + XLSX from markdown inputs |
| `branchnux validate` | Lint test-plan.md against JSON Schema; CI-safe exit codes |
| `branchnux demo` | Run bundled fixture, open report in browser, delete fixture — <90 seconds to first "aha" |
| `branchnux doctor` | Preflight check: Node version, Playwright, dev-vs-prod server detection, config discovery |
| `--industry general` | OWASP ASVS 4.0 + WCAG 2.2 AA standards alignment out of the box |
| `--plan-only` mode | Render a report without an execution log; "PLAN ONLY" badge in header |
| `[VERIFY]` markers | Every LLM-generated cell renders with a `[VERIFY]` tag until human-attested |
| JSON Schema | Published schema for `test-plan.md` frontmatter, `standards.json`, `findings.json` |
| `--json` global flag | Structured JSON output on stdout for CI/CD pipeline integration |
| Documented exit codes | Per-command exit code table; `validate` returns non-zero on schema errors |

**Reference artefacts shipped:**

- `examples/demo-dashboard/output/login-test-plan.md` — 15 fully populated TCs
- `examples/demo-dashboard/output/login-sca-v0.1.md` — 8-section SCA, public reference artifact

**Explicitly out of scope at v0.1:**

- LLM agents (discover, plan, codify, enrich, doc) — v0.2
- RTM generator — v0.2
- SCA generator — v0.2
- `--industry fintech|healthcare` flags — v0.2 (after OSCAL spike)
- gstack skill bundle — v0.3 (optional integration, not core)
- MCP server for Claude Code — v0.3
- UAT sign-off (BR-XX, e-signature) — v0.3

---

## v0.2 — Q3 2026 target (depends on traction + founder full-time decision per launch plan)

**Theme:** LLM acceleration + RTM + SCA. Close the manual gaps; extend BranchNuX to steps 4 and 5 of the regulator-evidence chain.

**New CLI verbs:**

| Command | Description |
|---------|-------------|
| `branchnux rtm` | Generate `requirements/TRACEABILITY.md` from REQUIREMENTS.md + sprint log + code grep |
| `branchnux sca init <surface>` | Scaffold a per-surface SCA from the 8-section template |
| `branchnux sca generate <surface>` | Auto-fill per-control evidence rows from current test results |
| `branchnux sca pdf <surface>` | Render latest SCA version to PDF (Chromium headless, no Pandoc required) |
| `branchnux discover <url>` | LLM agent browses the target page, emits draft scenarios.md |
| `branchnux plan <slug>` | LLM agent converts scenarios + DOM into test-plan.md |
| `branchnux codify <slug>` | LLM agent converts test-plan.md into spec.ts |
| `branchnux enrich <slug>` | LLM agent appends structural-context, a11y, and exploratory TCs to an existing plan |
| `branchnux batch-plan` | Parallel LLM agents for multi-page plan generation |

**New features:**

| Feature | Description |
|---------|-------------|
| OSCAL JSON export | Emit OSCAL Assessment Results JSON alongside markdown SCA (IBM Trestle integration) |
| `--industry fintech` | NIST 800-63B + NYDFS 23 NYCRR 500 + PSD2 + PCI DSS standards |
| `--industry healthcare` | HIPAA Security Rule + HITECH + NIST 800-66 standards |
| Eval harness | 5+ held-out SCA examples, scoring rubric (precision/recall on control-to-evidence joins), regression CI |
| Human-edit markers | `<!-- human:notes -->...<!-- /human:notes -->` spans survive RTM and SCA regeneration |
| `--max-spend <USD>` | Abort LLM operations if estimated cost exceeds the threshold |
| `--dry-run` for LLM ops | Print planned LLM calls and cost estimate before executing |

**Prerequisite (before v0.2 code starts):**

Run the OSCAL feasibility spike (1 day). FedRAMP RFC-0024 mandates machine-readable OSCAL packages by September 2026. OSCAL output format is load-bearing for federal and federal-adjacent customers and must be decided before the SCA renderer is written.

---

## v0.3 — Q4 2026 target if v0.2 + paying customers happen on schedule

**Theme:** UAT layer, multi-industry, ecosystem integrations. Make BranchNuX CISO-buyable.

**New features:**

| Feature | Description |
|---------|-------------|
| UAT sign-off workflow | Per-TC `uat_status` field (pending/accepted/rejected/needs-rework); stakeholder HTML dropdown; HMAC e-signature; `uat-log.jsonl` hash-chained audit trail |
| Business requirements (BR-XX) | BR-XX layer above R-XX; RTM gains a column; HTML report gains a Business Requirements tab |
| Per-environment test passes | `branchnux run <slug> --env staging`; `branchnux compare <slug> staging prod` cross-env diff |
| Visual regression | Per-TC baseline screenshots; pixel-diff flagging; `<TC-ID>-diff.png` alongside evidence |
| Cypress + Vitest adapters | Adapter pattern for non-Playwright test runners; one test plan, three possible spec languages |
| `--industry gov` | FedRAMP + FISMA + NIST 800-53 standards |
| gstack skill bundle | `/branchnux` as a first-class gstack skill; browser-coupled discovery via claude-in-chrome MCP |
| MCP server for Claude Code | BranchNuX as a Claude Code tool; inline plan generation, RTM queries, report access |
| `--industry edu` | FERPA + COPPA standards |

---

## What won't change

Three things in BranchNuX's design are intentional and will be defended against well-meaning scope creep:

1. **The artifact format.** Markdown plan + Playwright spec + per-TC screenshot + self-contained HTML + XLSX is the product. It will not become "configurable output formats" or "flexible templates."

2. **Git-native, repo-tracked.** Output lives in your repo, versioned with your code. The hosted SaaS tier (roadmap) sits on top of this, not instead of it.

3. **Deterministic core, LLM accelerator.** The `report` command will always work without an API key. LLM features will always be opt-in.

---

## Versioning policy

BranchNuX follows semver. Breaking changes to the test-plan.md schema or the folder convention require a major version bump. Minor versions add features; patch versions fix bugs. The JSON Schema files are versioned independently and backward-compatible within a major version.
