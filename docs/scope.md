# Scope: what 5-NUX is, what it isn't, and what's enough

> **What this is:** the honest version of "what 5-NUX does and doesn't do." If you're evaluating 5-NUX against alternatives or deciding whether you need to pair it with other tools, read this.
>
> **Tl;dr:** **5-NUX OSS on its own is sufficient to ship real regulated software and pass real audits.** Adjacent tools are optional pairings, not requirements.

---

## What 5-NUX is

A **regulated-software artifact + audit-evidence toolchain**, in CLI form, AI-agent native:

- Covers **Tier 4 (compliance / RTM / audit)** — the territory of IBM DOORS, Polarion, Jama Connect, codeBeamer
- Covers **Tier 5 (test management)** — the territory of TestRail, Zephyr, qTest
- Covers **part of Tier 2 (specs / docs / decisions)** — overlap with Confluence, Notion, Coda

It auto-generates the artifacts regulators actually ask for:

| Artifact | Verb | Format |
|---|---|---|
| **Requirements Traceability Matrix (RTM)** | `branchnux rtm` | Markdown |
| **Security Control Assessment (SCA)** | `branchnux sca <surface>` | Markdown + PDF |
| **NIST OSCAL 1.1.2 evidence** | `branchnux sca-oscal <surface>` | JSON |
| **HMAC-chained sign-off ledger** | `branchnux sign <surface>` | JSONL + PDF |
| **Test plans + execution evidence** | `branchnux plan` + `report` | Markdown + XLSX + HTML |
| **Risk register** | `rootnux risk-add` | Markdown |
| **ADRs (Architecture Decision Records)** | `rootnux adr-new <title>` | Markdown |
| **Knowledge base (system owner, vendor list, DR plan)** | `rootnux kb-init` | Markdown |
| **Sprint summaries (build narrative)** | `trunknux summarize` | Markdown |
| **Continuous-health snapshots** | `leafnux health` | Markdown + JSON |

For each, `--json` mode is available for agent-driven workflows.

## What 5-NUX is NOT

By design, 5-NUX does NOT replace these. **It pairs with them, and you don't have to use them either.** For each capability outside 5-NUX OSS scope, you have three orthogonal options — pick the one that fits your team:

| If you want... | A: Existing market apps | B: Build yourself | C: Engage LeapNuX premium |
|---|---|---|---|
| **Active task tracking + kanban boards** | GitHub Issues, Linear, Jira, Asana, Trello | Custom kanban over your `requirements/` + sprint-log/ | LeapNuX 6-NUX hosted board *(future)* |
| **Visual roadmap / Gantt timeline** | Productboard, Aha!, GitHub Projects, roadmap.io | Render a Gantt from sprint-log/ folder dates | LeapNuX 6-NUX roadmap view *(future)* |
| **Real-time team chat + notifications** | Slack, Discord, Microsoft Teams | Self-host Mattermost / Rocket.Chat | LeapNuX 6-NUX notification hub *(future)* |
| **Build + deploy pipelines** | GitHub Actions, CircleCI, Jenkins, Fly.io, Vercel | Self-host Drone, Concourse, Buildkite agents | Out of scope (use existing tooling — pipelines aren't where 6-NUX competes) |
| **GUI for non-technical stakeholders** (compliance officers, executives, board) | None that surface RTM/SCA/OSCAL natively | Render `--json` outputs into your own React/Vue dashboard | LeapNuX 6-NUX premium GUI *(future)* — purpose-built for compliance officers + executives + board |
| **Multi-user hosted dashboards / signed evidence portal** | None that map cleanly to OSCAL + HMAC ledger | Stand up a signed-portal yourself with the JSON outputs | LeapNuX 6-NUX premium evidence portal *(future)* — account-bound access, per-stakeholder views |
| **Account-bound auditor access + per-firm scoping** | DocuSign Rooms, ShareFile (generic, not artifact-aware) | Build access control on top of your repo + cloud storage | LeapNuX 6-NUX premium audit-room *(future)* |
| **Professional support contract + SLA** | None for OSS RTM tooling | Hire a freelance compliance engineer | LeapNuX 6-NUX premium support tier *(future)* |

## What's actually enough

The most common question after reading the table above: *"Is 5-NUX OSS by itself enough, or do I really need the others?"*

The honest answer:

- ✅ **Ship a SOC 2 / ISO 27001 / NYDFS / GDPR / HIPAA regulated app using just 5-NUX OSS + a free GitHub repo? Yes.** This works.
- ✅ **Pass an external audit with 5-NUX-generated artifacts? Yes.** RTM, SCA, OSCAL, and HMAC-signed evidence is exactly what auditors review. No SaaS dependency.
- ✅ **Run the whole evidence pipeline as part of CI, with an LLM agent driving it? Yes.** Every verb is CLI + plain files + `--json` modes. Agents drive 5-NUX the same way humans do.
- ⚠️ **Want a click-driven UI for non-engineers, multi-user hosted dashboards, or an account-bound evidence portal for external stakeholders?** Either build it yourself, or engage [LeapNuX 6-NUX premium](./MOTTO.md) when it ships (commercial product, future).

## Comparison with adjacent OSS tooling

5-NUX overlaps with several adjacent OSS tools but doesn't directly compete with any of them. The overlap and gaps:

| OSS tool | What it does | Overlap with 5-NUX | Gap |
|---|---|---|---|
| **GitHub Issues / Projects** | Task tracking, kanban | None — 5-NUX is artifact-evidence focus | Pair them: GitHub for tickets, 5-NUX for evidence |
| **Backstage** (Spotify) | Developer portal, service catalog | None — Backstage is service-graph, 5-NUX is project-evidence | Independent |
| **MkDocs / Docusaurus** | Static docs site | None — those publish docs, 5-NUX produces audit artifacts | Pair: MkDocs for public docs, 5-NUX for evidence in `requirements/` |
| **OSS RTM / requirements-management tools** (the few that exist: ReqIF tools, Doorstop, etc.) | Requirements tracking | Overlap: 5-NUX rootnux + branchnux rtm covers similar ground | 5-NUX adds OSCAL export + HMAC sign-off + AI-native CLI surface |
| **Allure / TestRail OSS** | Test reporting | Partial overlap with branchnux report | 5-NUX adds RTM cross-link + audit-evidence chain |

## Comparison with enterprise compliance tooling

This is where 5-NUX's differentiation is sharpest:

| Tool | License | Cost (typical) | OSS-CLI mode? | AI-agent native? | OSCAL export? | HMAC-signed evidence? |
|---|---|---|---|---|---|---|
| **IBM DOORS / DOORS Next** | Commercial | $5,000+/seat/year | ❌ | ❌ | partial | ❌ |
| **Polarion ALM** | Commercial | $3,000+/seat/year | ❌ | ❌ | partial | ❌ |
| **Jama Connect** | Commercial | $2,500+/seat/year | ❌ | ❌ | ❌ | ❌ |
| **codeBeamer** | Commercial | $2,000+/seat/year | ❌ | ❌ | partial | ❌ |
| **Polarion Requirements** | Commercial | $1,500+/seat/year | ❌ | ❌ | ❌ | ❌ |
| **5-NUX** | **Apache 2.0** | **$0** | **✅** | **✅** | **✅** | **✅** |

The trade-offs are real:

- 5-NUX has **no GUI** for non-technical stakeholders (yet). DOORS/Polarion/Jama have rich GUIs. (Coming via 6-NUX premium.)
- 5-NUX has **no multi-user real-time collaboration**. Enterprise tools have full collab features. (Coming via 6-NUX premium.)
- 5-NUX has **no professional support contract**. Enterprise tools have 24/7 support. (Coming via 6-NUX premium.)

But for the **artifacts an auditor reviews**, 5-NUX produces equivalent-or-better output (OSCAL 1.1.2 export beats most enterprise tools), in plain files, free, in your repo.

## When 5-NUX is the wrong choice

Be honest about this:

- **You need a kanban board your team lives in** — use GitHub Projects, Linear, Jira. 5-NUX won't replace those.
- **You need real-time multi-user collaboration during sprint planning** — use a SaaS PM tool. 5-NUX is single-user CLI.
- **You need a vendor with 24/7 support contract for compliance audits** — at OSS scale, use codeBeamer or DOORS with a support tier; 5-NUX has no SLA.
- **Your team has zero CLI comfort** — 5-NUX assumes terminal fluency. (Until 6-NUX premium ships a GUI, you'd be paddling upstream.)
- **You don't ship regulated software** — RTM/SCA/OSCAL aren't your problem. You'd be paying the regulated-software ceremony tax for nothing. Use Linear or whatever your team prefers.

For everyone else — regulated-software teams who treat AI as a partner and want their evidence chain in plain files in their git repo — 5-NUX is exactly what they're shopping for.

## Adoption sequence

If you're convinced and want to start, the typical adoption sequence:

1. **Read** [`docs/getting-started.md`](./getting-started.md)
2. **Install** the meta-package: `npm install -g @leapnux/5nux` (after we publish to npm)
3. **Run `rootnux init`** in your project root — scaffolds REQUIREMENTS.md, TRACEABILITY.md, risks register, docs/adr/
4. **Author your R-XX requirements** in REQUIREMENTS.md (or import from your existing spec docs)
5. **Run `branchnux init <surface>`** for your first surface (e.g. login)
6. **Run `branchnux plan <surface>`** to generate a test plan via Claude API
7. **Work through `[VERIFY]` markers** as a team
8. **Run `branchnux rtm`** to generate the traceability matrix
9. **Run `branchnux sca <surface>`** when you're ready to produce the SCA
10. **Run `branchnux sign <surface>`** for the HMAC-chained attestation

That's the lifecycle. Three or four iterations and you have audit-ready evidence — generated by your AI agents, attested by your human team, in plain files in your repo.
