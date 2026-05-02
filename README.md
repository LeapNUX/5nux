# 5-NUX

**A free, open-source project-management toolkit you run from the terminal** — built for software teams that have to prove their work to auditors, regulators, or compliance officers. It auto-generates the paperwork those reviewers ask for, straight out of your git repo.

> 5-NUX gives you a whole tree. You provide the soil and you ship yourself.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Node: >=20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)
[![Tests: 587 passing](https://img.shields.io/badge/tests-587%20passing-brightgreen.svg)]()
[![Version: v0.5.0-alpha.1](https://img.shields.io/badge/version-v0.5.0--alpha.1-orange.svg)](CHANGELOG.md)
[![AI-agent native](https://img.shields.io/badge/AI--agent-native-9333ea.svg)]()

---

## A quick glossary (read this first)

5-NUX touches a few areas with their own jargon. Here's the plain-English version we'll use throughout.

**The tool names — don't be put off by them.** The five tools are named after parts of a tree (root, trunk, branch, leaf, fruit) because each one maps to a stage of a project's life. You don't have to memorize them — just remember what each tool *does*:

| Tool name | Just think of it as… | What it does in one line |
|---|---|---|
| **rootnux** | the **Planning** tool | Writes specs, decision records, risk register, knowledge base |
| **trunknux** | the **Sprint** tool | Sets up sprint folders and weekly logs |
| **branchnux** | the **Test** tool | Drafts test plans and runs reports |
| **leafnux** | the **Health-Check** tool | Red/amber/green snapshot of your project |
| **fruitnux** | the **Audit-Pack** tool | Generates the paperwork auditors ask for |
| **5nux** | the **Bundle** | One install that gives you all five tools |
| **6nux-core** | the **Shared library** | Internal — you don't run it directly |

**The audit and compliance jargon:**

| Term you'll see | What it actually means |
|---|---|
| **Regulated software** | Anything that has to pass audits — finance, health-tech, government, anything bound by SOC 2, FedRAMP, HIPAA, ISO, etc. |
| **RTM** (Requirements Traceability Matrix) | A spreadsheet that links each requirement to the code that implements it and the test that proves it. Auditors ask for this constantly. |
| **SCA** (Security Control Assessment) | A short report that says "here's a security control, here's how we implemented it, here's the evidence it works." |
| **OSCAL** | A machine-readable format (JSON) the U.S. government uses for compliance reports. Auditors at FedRAMP and SOC 2 firms can ingest it directly. |
| **HMAC sign-off** | A cryptographic signature on each entry, chained together so any later edit is detectable. Think "tamper-proof receipt." |
| **ADR** (Architecture Decision Record) | A one-page note explaining why you made a key technical choice (e.g. "we picked Postgres over Mongo because…"). |
| **`[VERIFY]` marker** | A flag on AI-drafted text that means "a human still has to read this and confirm it before it counts as verified." |
| **Verb** | A subcommand you run, like `git commit` or `npm install`. Each 5-NUX tool is a small CLI with a handful of verbs. |

---

## What 5-NUX does for your project

It runs the full project paper trail — **requirement → sprint → test → check → audit hand-off** — entirely from the terminal, as plain files in your git repo. No SaaS subscription, no login, no vendor you can't replace.

Two things make it different from every other open-source project tool:

1. **Built for teams that have to pass audits.** It auto-generates the documents reviewers actually ask for — traceability matrices, security control reports, machine-readable compliance JSON, tamper-proof sign-off ledgers. It's the open-source alternative to enterprise tools like IBM DOORS, Polarion, Jama, and codeBeamer (which charge $1k–$5k+ per seat per year and lock your data inside their database). See [`docs/scope.md`](docs/scope.md) for the full comparison.
2. **Designed to work alongside AI coding assistants.** Every artifact is a plain text file, every command produces machine-readable output (`--json`), so an AI agent can drive 5-NUX the same way a human can — no special API, no auth dance. A direct Claude Code integration (Model Context Protocol — Anthropic's standard for letting AI assistants call external tools) is coming in v0.6+; today you can already invoke any verb via `npx branchnux <command>`. See [`docs/collaboration.md`](docs/collaboration.md) for how AI and humans split the work.

What you actually get:

| What you want | The command | What lands in your repo |
|---|---|---|
| Regenerate the traceability matrix (every requirement ↔ its code ↔ its tests) | `fruitnux rtm` *(audit-pack tool)* | `requirements/TRACEABILITY.md` |
| An auditor-ready security control report (8 standard sections) | `fruitnux sca generate <surface>` | `sca/<surface>.md` |
| The same report in the U.S. government's machine-readable JSON format | `fruitnux sca oscal <surface>` | OSCAL 1.1.2 JSON file |
| A cryptographically signed PDF — any later tampering is detectable | `fruitnux sign <surface>` | Signed PDF + sign-off ledger |
| A "why we chose this" decision record, auto-numbered | `rootnux adr-new <title>` *(planning tool)* | `docs/adr/NNNN-<slug>.md` |
| A new entry in your risk register | `rootnux risk-add` | row appended to `requirements/risks/risks.md` |
| A dated sprint folder with starter README and log | `trunknux new-sprint <slug>` *(sprint tool)* | `sprint-log/<date>_<slug>/` |
| An AI-drafted test plan (every AI line flagged for human review) | `branchnux plan <slug>` *(test tool)* | `testing-log/<date>_<slug>/test-plan.md` |
| A red/amber/green snapshot of your whole project | `leafnux health` *(health-check tool)* | terminal output (or JSON) |

> **Is 5-NUX by itself enough to ship and pass audits?** Yes. Other tools (kanban boards, team chat, dashboards, CI/CD) are nice pairings, not requirements.

### What 5-NUX *doesn't* include — and your three options

For each capability outside 5-NUX, you have three choices:

| If you want… | A: Use an existing app | B: Build it yourself | C: Pay for the LeapNuX hosted version |
|---|---|---|---|
| **Task tracking + kanban** | GitHub Issues, Linear, Jira, Asana, Trello | A custom kanban over the markdown files | LeapNuX hosted board |
| **Roadmap / Gantt timeline** | Productboard, Aha!, GitHub Projects | Render a Gantt from sprint folder dates | LeapNuX roadmap view |
| **Team chat + notifications** | Slack, Discord, Microsoft Teams | Self-host Mattermost / Rocket.Chat | LeapNuX notification hub |
| **Build + deploy pipelines** | GitHub Actions, CircleCI, Jenkins, Vercel | Self-host Drone / Concourse | Out of scope (use existing tools) |
| **A nice GUI for non-technical stakeholders** (compliance, executives, board) | None that show traceability and security reports natively | Render the `--json` output into your own dashboard | LeapNuX premium GUI, designed for compliance reviewers |
| **Multi-user hosted dashboards / signed evidence portal** | None mapped cleanly to compliance JSON + tamper-proof ledger | Build a portal yourself off the JSON outputs | LeapNuX premium evidence portal |
| **Per-auditor access controls** | DocuSign Rooms, ShareFile (generic) | Add access control on top of your repo + cloud storage | LeapNuX premium audit-room |
| **A support contract with a real SLA** | None for open-source traceability tooling | Hire a freelance compliance engineer | LeapNuX premium support |

**Column A** is what most teams reach for first — pair it with 5-NUX, no integration needed. **Column B** is the DIY path against the JSON output of every verb. **Column C** is when you want a turn-key commercial product with hosting, multi-user roles, and per-auditor access — that's [LeapNuX premium](docs/MOTTO.md).

For the full "what's enough" breakdown and comparison vs. enterprise tools — see [`docs/scope.md`](docs/scope.md).

---

## Where 5-NUX fits — the four-layer stack

5-NUX isn't a standalone product competing with anything. It's the **project-management-and-audit layer** in a four-layer stack you assemble from open-source pieces:

```
  ┌─────────────────────────────────────────────────────────┐
  │ LAYER 4 — YOUR PROJECT                                  │
  │   Whatever you're actually building — a fintech app,    │
  │   an e-commerce site, a health-tech platform, etc.      │
  └─────────────────────────────────────────────────────────┘
                              ▲
  ┌─────────────────────────────────────────────────────────┐
  │ LAYER 3 — WORKFLOW TOOLS  (third-party, open-source)    │
  │                                                         │
  │   • gstack — DEVELOPMENT workflow                       │
  │     /codex /cso /review /ship /qa /plan-eng-review      │
  │     "how to write, review, and ship code"               │
  │                                                         │
  │   • 5-NUX — PROJECT-MANAGEMENT + AUDIT workflow (this)  │
  │     rootnux trunknux branchnux leafnux fruitnux soilnux │
  │     "how to plan, verify, and audit what was built"     │
  │                                                         │
  │   Same audience, different jobs. They complement each   │
  │   other — they don't compete.                           │
  └─────────────────────────────────────────────────────────┘
                              ▲
  ┌─────────────────────────────────────────────────────────┐
  │ LAYER 2 — AI EXTENSION POINTS  (built into Claude Code) │
  │   Skills · Hooks · MCP · Sub-agents · Memory            │
  └─────────────────────────────────────────────────────────┘
                              ▲
  ┌─────────────────────────────────────────────────────────┐
  │ LAYER 1 — THE AI ASSISTANT ITSELF                       │
  │   Claude Code — Anthropic's AI agent in your terminal   │
  └─────────────────────────────────────────────────────────┘
```

**One-liner:** *the project-management and audit layer for AI-assisted development. Pairs with [gstack](https://github.com/gstack-tools/gstack) for development workflow. Both run on top of [Claude Code](https://docs.anthropic.com/claude-code).*

### Common questions

| Question | Answer |
|---|---|
| *Isn't 5-NUX just gstack?* | No. gstack handles **development** workflow (review code, ship code, run QA). 5-NUX handles **project management and audits** (traceability, security reports, tamper-proof sign-off, risk register, decision records). Same audience, different jobs. A regulated team needs both. |
| *Isn't this just Claude Code?* | No. Claude Code is the **AI assistant**. 5-NUX is the **playbook** that runs on top of it. Like asking "isn't Linux just the kernel?" — the kernel doesn't decide your build process. |
| *Why not Jira / Linear / Notion / Confluence?* | Those are SaaS apps with their own database. 5-NUX lives in your git repo — every artifact is a markdown file, every command has a JSON output. Different category. Use them **alongside** 5-NUX (kanban in Linear, audit trail in 5-NUX). |
| *Do I have to use Claude Code?* | No. The verbs run as plain Node.js — you don't need any AI assistant for the open-source path. Claude Code makes things faster; 5-NUX works with or without it. |

### Why a stack of small tools beats one big SaaS

- **No lock-in.** Every layer is open-source and replaceable. Outgrow gstack? Swap it. Want to fork 5-NUX? Fork it. Your data is markdown in your git repo.
- **No procurement cycle.** Three `npm install -g` commands instead of three vendor reviews.
- **Audit-ready by default.** Your git history is the audit trail. The 5-NUX layer generates the reports auditors want — without any extra tooling.

---

## The seven packages

The names follow a tree metaphor — each package maps to a project stage. The "just call it…" column is the friendly name we use in conversation.

| Just call it… | Package name | What it does | Status | Commands |
|---|---|---|---|---|
| The **Planning** tool | `@leapnux/rootnux` | Specs, decision records, risks, knowledge base | active | `init`, `lint`, `adr-new`, `risk-add`, `status`, `kb-init` |
| The **Sprint** tool | `@leapnux/trunknux` | Sprint folders + weekly logs | active | `new-sprint`, `summarize`, `lint`, `log` |
| The **Test** tool | `@leapnux/branchnux` | Test plans, reports, AI-drafted planning | active | `init`, `plan`, `codify`, `enrich`, `discover`, `batch-plan`, `report`, `validate`, `run`, `compare`, `visual baseline`, `visual compare`, `doctor`, `demo` (~14 commands) |
| The **Audit-Pack** tool | `@leapnux/fruitnux` | Security reports, compliance JSON, sign-off, traceability | active | `sca init`, `sca generate`, `sca pdf`, `sca oscal`, `sign`, `sign pdf`, `sign stale-check`, `br init`, `br link`, `br rtm`, `rtm` (~11 commands) |
| The **Health-Check** tool | `@leapnux/leafnux` | Ongoing project-state snapshot | active | `health` |
| The **Shared library** | `@leapnux/6nux-core` | Internal — you don't run it directly | active | — |
| The **Bundle** | `@leapnux/5nux` | One install that pulls in all five tools at once | active | — |

---

## Install

> **Not yet on npm.** The `@leapnux/*` namespace is being claimed; until then, clone this repo and run the package binaries from the workspace root.

```sh
# Coming soon (once the @leapnux namespace is claimed on npm):
npm install -g @leapnux/5nux        # the whole bundle (all five tools + shared library)
npm install -g @leapnux/rootnux     # just specs + decisions + risks + knowledge base
npm install -g @leapnux/trunknux    # just sprint folders
npm install -g @leapnux/branchnux   # just test planning + reports
npm install -g @leapnux/fruitnux    # just audit hand-off (security reports, compliance JSON, sign-off, traceability)
npm install -g @leapnux/leafnux     # just ongoing health check
```

**Until then — install from source:**

```sh
git clone https://github.com/leapnux/5nux.git
cd 5nux
npm install
```

---

## Quick tour

Each line below is annotated with the friendly tool name in `[brackets]` so you can see which tool you're invoking.

```sh
# [Planning tool]
rootnux init                                          # set up REQUIREMENTS.md + traceability + risks + decision-record folders
rootnux adr-new "Use PostgreSQL for primary store"    # new decision record, auto-numbered
rootnux kb-init                                       # set up the knowledge-base scaffold (audit-prep sections)

# [Sprint tool]
trunknux new-sprint v1-launch                         # new dated sprint folder
trunknux summarize                                    # auto-generate a sprint summary from your git log

# [Test tool]
branchnux plan login                                  # AI-drafted test plan (every AI line flagged for human review)

# [Audit-Pack tool]
fruitnux rtm                                          # regenerate the traceability matrix
fruitnux sca init login                               # set up an 8-section security control report
fruitnux sca generate login                           # fill in the report from your test results
fruitnux sca oscal login                              # export it as government-standard compliance JSON
fruitnux sign login                                   # cryptographically sign the report — tampering is detectable

# [Health-Check tool]
leafnux health                                        # red / amber / green snapshot of project state
```

Full command reference: [`docs/reference.md`](docs/reference.md). First-15-minutes walkthrough: [`docs/getting-started.md`](docs/getting-started.md).

---

## Who runs what — and where AI helps

Each tool serves a different role on the team, with a different relationship to AI-drafted content:

| Tool | Stage | Who uses it | What AI does here |
|---|---|---|---|
| **Planning tool** (`rootnux`) | Requirements | Product / project manager / spec author | Drafts requirement entries, sets up decision records |
| **Sprint tool** (`trunknux`) | Development | Developer / engineer | Summarizes the git log, drafts the sprint narrative |
| **Test tool** (`branchnux`) | Test + verification | QA / test lead | Discovers test scenarios, drafts test plans (each AI line flagged for human review) |
| **Health-Check tool** (`leafnux`) | Ongoing health | Engineer / SRE | Reads the artifacts, computes a red/amber/green status |
| **Audit-Pack tool** (`fruitnux`) | Audit hand-off | Compliance / legal / external auditor | Generates security reports, compliance JSON, sign-off ledgers, traceability |

For where the AI/human boundary sits at each stage, the four collaboration patterns (drafted-by-AI / confirmed-by-human, append-only enrichment, one agent per topic, cost-gated automation), and the typical end-to-end cycle — see [`docs/collaboration.md`](docs/collaboration.md).

---

## Folder layout in your project

The five tools produce **peer folders** at the root of your project — different roles, different folders, parallel views of the same project. Nothing is nested under another tool:

```
your-project/
├── requirements/                  ← Planning tool (rootnux) — Product / PM
│   ├── REQUIREMENTS.md            ← R-XX requirement entries
│   ├── TRACEABILITY.md            ← traceability matrix (generated by Audit-Pack tool)
│   ├── risks/risks.md             ← risk register
│   └── validations/<surface>/     ← test results + audit packets (Test + Audit-Pack tools)
│
├── docs/                          ← Planning tool (rootnux) — Product / PM
│   ├── adr/NNNN-<slug>.md         ← decision records (rootnux adr-new)
│   └── KNOWLEDGE_BASE.md          ← knowledge-base scaffold (rootnux kb-init)
│
├── sprint-log/                    ← Sprint tool (trunknux) — Dev / Eng
│   └── <date>_<slug>/
│       ├── README.md              ← sprint scaffold (trunknux new-sprint)
│       ├── LOG.md                 ← weekly journal entries (trunknux log)
│       └── SPRINT_SUMMARY.md      ← git-log roll-up (trunknux summarize)
│
├── testing-log/                   ← Test tool (branchnux) — QA / test lead
│   └── <date>_<surface>/
│       ├── test-plan.md           ← test cases + Given/When/Then steps (branchnux plan)
│       ├── execution-log.md       ← run results (auto-generated)
│       └── evidence/              ← screenshots, logs (auto)
│
├── <your-app-source>/             ← your code (whatever framework — outside 5-NUX scope)
│
└── (Health-Check output: lives in your CI / dependabot / observability tools — not in the repo)
```

The five tools do **not** import each other — they coordinate through file conventions in `@leapnux/6nux-core`. Implementation details: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 📚 Documentation

- **[`docs/MOTTO.md`](docs/MOTTO.md)** — what's free vs. what's a paid premium offering (and why we keep that line sharp)
- **[`docs/scope.md`](docs/scope.md)** — what 5-NUX is, what it isn't, what's enough on its own; comparison vs. DOORS / Polarion / Jama
- **[`docs/collaboration.md`](docs/collaboration.md)** — who does what, and how AI and humans collaborate at each stage
- **[`docs/6-NUX.md`](docs/6-NUX.md)** — the conceptual model (root / trunk / branch / leaf / fruit / soil)
- **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** — implementation details (monorepo layout, package contracts, security model)
- **[`docs/concepts.md`](docs/concepts.md)** — three-track discipline, `[VERIFY]` markers, the cryptographic chain, deterministic-core vs. opt-in-AI split
- **[`docs/getting-started.md`](docs/getting-started.md)** — your first 15 minutes
- **[`docs/reference.md`](docs/reference.md)** — full command reference
- **[`docs/adr/`](docs/adr/)** — decision records (7 locked architectural decisions, all written via `rootnux adr-new` itself)
- **[`CHANGELOG.md`](CHANGELOG.md)** — release history
- **[`CONTRIBUTING.md`](CONTRIBUTING.md)** — how to contribute (commit sign-off, hygiene rules, workspace workflow)

---

## Roadmap

- **v0.4.x** — alpha series; rootnux + trunknux + branchnux mature; leafnux + fruitnux brought into active scope
- **v0.5.0-alpha.1** — `trunknux log`, `rootnux kb-init`, `leafnux health` shipped; `fruitnux pack` in design
- **v0.6** — direct Claude Code integration (Anthropic's Model Context Protocol — wires 5-NUX commands straight into your AI assistant via `.claude/settings.json`)
- **v1.0** — stability + landing page at leapnux.com + the commercial premium spec

[Open an issue](https://github.com/leapnux/5nux/issues) to vote on what to prioritize next.

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Quick version: sign your commits with `git commit -s` (a one-line "I wrote this" certificate — no extra paperwork to sign), include tests with every pull request, open an issue first for anything large.

---

## License

Apache 2.0. See [LICENSE](LICENSE).

"BranchNuX™" and "LeapNuX™" are trademarks of Chu Ling. See [NOTICE](NOTICE) for trademark terms. The Apache 2.0 license covers the code; the trademark covers the name.

## Author

Chu Ling — ccling1998@gmail.com.
Security reports: [GitHub Private Vulnerability Reporting](https://github.com/leapnux/5nux/security/advisories/new) (preferred).
