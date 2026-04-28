# Collaboration: stakeholders, humans, and AI agents

> **What this is:** how different roles use 5-NUX, and where the boundary between AI-drafted content and human-attested content lives at each stage of the project lifecycle. If you're trying to understand who runs which verb and how AI fits into the workflow, you're in the right place.
>
> **Companion docs:** [`docs/MOTTO.md`](./MOTTO.md) for the OSS/Premium product split. [`docs/6-NUX.md`](./6-NUX.md) for the artifact taxonomy. [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) for implementation spec.

---

## Stakeholder × Node × AI-role matrix

The five OSS NUX nodes serve five different stakeholders. Each stakeholder has a different relationship with AI-drafted content — what AI can and can't do for them, and where the human attestation gate sits.

| Node | Lifecycle stage | Human stakeholder | What AI typically does | Where the human/AI boundary sits |
|---|---|---|---|---|
| **rootnux** | Requirement | Product / PM / spec author | Drafts R-XX entries, suggests acceptance criteria, scaffolds ADR templates, suggests risks | Human authors the *intent*; AI drafts the *expression*. PM reviews every R-XX before sprint planning. |
| **trunknux** | Development | Dev / Eng / contributor | Generates `SPRINT_SUMMARY.md` from git log; can draft initial sprint plans; never rewrites human-curated narrative | **Append-only enrichment** rule: AI adds new sections, never edits existing ones. **One-agent-per-slug** rule: parallel agents never share a sprint folder. |
| **branchnux** | Test + validation | QA / Test lead / auditor-facing | Discovers test scenarios from URLs (`discover`), drafts test plans (`plan`), generates Playwright spec.ts (`codify`), enriches plans (`enrich`), drafts sign-off justifications (`--justify-with-llm`) | **`[VERIFY]` markers** on every LLM-drafted cell. **Cost gates** (`--max-spend`, `--dry-run`) on every LLM verb. Human gates the *removal* of each `[VERIFY]` marker — that act IS the attestation. |
| **leafnux** | Continuous health | Eng / SRE / dev-loop | Reads existing artifacts, computes RAG status, identifies stale items, generates `--json` output for dashboards | Read-only over project state — no attestation needed. Safe for fully-automated CI invocation. |
| **fruitnux** | Audit-ready handoff | Compliance / Legal / external auditor | Bundles ADRs + RTM + SCAs into regulator-ready packets, summarizes evidence chain for non-technical stakeholders | Human signs the final packet via HMAC chain (`branchnux sign`). Bundling is mechanical; attestation is human. |

## The four AI/human collaboration patterns

5-NUX uses four distinct patterns for AI involvement, each tuned to the stakes of the artifact being produced:

### 1. **Drafted by AI, attested by human** (most rootnux + branchnux verbs)

AI does the writing-from-blank-page work; humans do the verification work. The `[VERIFY]` marker is the literal contract — every LLM-drafted cell has one, and human attestation is the act of removing it after reading.

> Example: `branchnux plan login` produces `test-plan.md` with `[VERIFY]` on every TC. The QA lead reads each TC, confirms it matches actual login behavior, and removes the marker. **Removing a `[VERIFY]` without reading the underlying content is the one way to make an audit fail.**

### 2. **Append-only enrichment** (trunknux summarize, branchnux enrich)

When AI adds to an existing artifact, it writes new sections — never rewrites old ones. Human-curated content survives every regenerate cycle.

> Example: a sprint folder's `LOG.md` has 5 hand-written daily entries. `trunknux summarize` adds a new `SPRINT_SUMMARY.md` next to it. The hand-written `LOG.md` is never touched.
>
> Same for `branchnux enrich` — three append-only passes (security gaps, accessibility gaps, edge cases) write new sections at the bottom of `test-plan.md`, never rewriting earlier content.

### 3. **One-agent-per-slug** (parallel branchnux agent runs)

When multiple AI agents run in parallel against the same project, each gets its own `<slug>` and its own folder. Never two agents writing to the same `testing-log/2026-04-28_login/test-plan.md` at the same time.

> Real production discipline: the spec template auto-generates per-test `X-Forwarded-For` headers to isolate rate-limit buckets, and the `branchnux init` scaffold uses date+slug folder naming so two parallel "test login" agents land in different folders by construction.

### 4. **Cost-gated automation** (every LLM verb)

Every verb that calls an LLM API has explicit cost controls:

| Flag | What it does |
|---|---|
| `--dry-run` | Estimates the API cost without making the call. Mandatory first run for any new project. |
| `--max-spend <usd>` | Aborts the verb mid-run if cost exceeds the cap. Bounds runaway agent loops. |
| `--json` | Structured output for downstream agent processing — no parsing of human-format messages. |

This makes 5-NUX safe to invoke from agent-driven CI workflows without surprise billing.

## Why this design vs. SaaS PM tools

Most enterprise PM tools (DOORS, Polarion, Jama, codeBeamer) were designed pre-LLM. They have proprietary APIs that require custom SDK integration per agent, click-driven UIs that don't translate to agent invocation, and proprietary data formats that an LLM can't grep.

5-NUX inverts every one of those assumptions:

| Anti-pattern in pre-LLM tools | 5-NUX equivalent |
|---|---|
| Proprietary SDK per agent integration | Plain shell — `bash -c "branchnux rtm"` |
| Click-driven UI flows | CLI verbs — same surface for human and agent |
| Locked database schema | Plain Markdown / YAML / JSON / XLSX / PDF — universal LLM-readable formats |
| Human-only attestation flows | `[VERIFY]` markers + HMAC-chained signoff — same flow whether human or agent appended |
| Hidden audit log | Git log + `trunknux summarize` — your existing version control IS the audit log |

**The same person can run `branchnux rtm` in their terminal in the morning, and have a Claude Code agent run it in CI in the afternoon.** Same artifact, same evidence chain, same sign-off ledger. The agent isn't "integrating with" 5-NUX — it's USING 5-NUX, the same way the human does.

## Tested agent ecosystems

5-NUX is verified to work cleanly with these AI-agent workflows (no special integration required, just plain CLI invocation):

- **Claude Code** (Anthropic) — primary development environment
- **Cursor** — file edits + CLI
- **Aider** — git-aware agent loops
- **Cline** (formerly Claude Dev) — VS Code-integrated agent
- **OpenAI Codex CLI** — second-opinion adversarial reviews via the gstack `/codex` skill
- **MCP-enabled tooling** — `branchnux mcp` server (planned v0.3+) will expose verbs as MCP tools

If your agent can run a shell command and read/write files, 5-NUX works.

## Putting it together: a typical regulated-software cycle

A real project with both human stakeholders and AI agents in the loop, end-to-end:

1. **PM drafts R-XX entries** with AI assistance via `rootnux init` + `rootnux adr-new`. The PM reviews each requirement; AI drafts the language.
2. **Dev creates a sprint** via `trunknux new-sprint v1-launch`. Daily `trunknux log` entries during the sprint mix human-written narrative and AI-summarized standups.
3. **QA runs `branchnux plan login`** — AI generates test plan with `[VERIFY]` markers. QA lead works through TCs; each removed `[VERIFY]` is an attestation.
4. **CI agent runs `branchnux validate` + `branchnux report`** on every PR. No human in the loop here — these are deterministic validators, no LLM involved.
5. **`branchnux rtm` regenerates** TRACEABILITY.md after every spec change. Cross-package agent or human-driven; same output either way.
6. **Compliance officer runs `branchnux sca login`** to produce the Security Control Assessment. AI drafts justifications; compliance officer reviews and signs.
7. **`branchnux sign --justify-with-llm`** drafts the final attestation; the human signer reviews, then signs (HMAC-chained).
8. **`branchnux sca-oscal login`** emits NIST OSCAL 1.1.2 JSON for the auditor.
9. **External auditor opens the artifacts directly** — Markdown for prose, XLSX for matrix data, PDF for signed packets, OSCAL JSON for machine ingestion. No login. No SaaS portal. No vendor.

Every artifact lives in your repo. Every step is reproducible. Every attestation is verifiable independent of the tool. AI agents accelerate the authoring; humans gate every artifact that an auditor will see.

That's the design.
