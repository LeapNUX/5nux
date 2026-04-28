# Integrations

5-NUX is OSS PM-tool-chain in CLI form. Every package is a standalone Node.js binary, every artifact is a plain file, every output has a `--json` mode. That makes integration trivial — you don't need an SDK, you `bash -c "<verb>"` and read the file.

This doc covers (a) the standalone CLI surface, (b) AI-agent integration, (c) GRC platform compatibility, (d) MCP server status.

---

## Standalone CLIs (current)

The 5 active NUX packages each ship a Node.js CLI. Install the meta-package or any subset:

```bash
npm install -g @leapnux/5nux                  # full stack
# or individually:
npm install -g @leapnux/rootnux               # specs / ADRs / risks / KB
npm install -g @leapnux/trunknux              # sprint scaffolding
npm install -g @leapnux/branchnux             # verification + RTM + SCA + OSCAL + sign
npm install -g @leapnux/leafnux               # continuous-health snapshots
npm install -g @leapnux/fruitnux              # external deliverables (verbs in design)
```

> **Note:** the `@leapnux/*` npm scope claim is in progress. Until then, install from GitHub: `npm install -g github:leapnux/5nux`.

**Requirements:** Node.js 20+. `branchnux discover/plan/codify/enrich` are LLM-powered and call the Anthropic API via `@anthropic-ai/sdk` — installed as an **optional peer dependency**, only required when those specific verbs are invoked.

The deterministic-core verbs (`init`, `report`, `validate`, `rtm`, `sca`, `sca-oscal`, `sign`, `health`, `new-sprint`, `summarize`, etc.) make zero network calls and require no API key. Output lives in your repo.

---

## LLM acceleration (current, opt-in)

LLM-powered verbs ship today behind explicit cost gates:

| Verb | What it does |
|---|---|
| `branchnux discover` | Crawl a URL surface and propose test scenarios |
| `branchnux plan` | Draft `test-plan.md` with `[VERIFY]` markers on every TC |
| `branchnux codify` | Generate Playwright `spec.ts` from `test-plan.md` |
| `branchnux enrich` | Append-only enrichment passes (security gaps, accessibility gaps, edge cases) |
| `branchnux sca` | Generate Security Control Assessment from test results + R-XX evidence |

Cost-control surface (every LLM verb):

- `--dry-run` — prints planned LLM calls and estimated cost; mandatory first run for any new project.
- `--max-spend <USD>` — aborts mid-run if cost exceeds the cap.
- `--json` — structured output for downstream agent processing.

Configurable via `--model` flag; default is a Sonnet-class model for mechanical tasks, Opus-class for reasoning. All LLM-generated cells render with `[VERIFY]` markers until human-attested — see [`docs/collaboration.md`](./collaboration.md).

---

## AI-agent ecosystems (current)

5-NUX is verified to work cleanly with these agent workflows — no special integration required, just plain CLI invocation:

- **Claude Code** (Anthropic) — primary development environment
- **Cursor** — file edits + CLI
- **Aider** — git-aware agent loops
- **Cline** — VS Code-integrated agent
- **OpenAI Codex CLI** — second-opinion adversarial reviews via the gstack `/codex` skill
- **MCP-enabled tooling** (see below)

If your agent can run a shell command and read/write files, 5-NUX works. The agent uses 5-NUX the same way a human does — same verbs, same artifacts, same evidence chain.

---

## MCP server (in design)

A `branchnux mcp` Model Context Protocol server is in design — will expose every branchnux verb as an MCP tool callable from Claude Code, Cline, and any MCP-enabled client. Target shape once shipped:

```json
// .claude/settings.json
{
  "mcpServers": {
    "branchnux": {
      "command": "npx",
      "args": ["-y", "@leapnux/branchnux", "mcp"]
    }
  }
}
```

Until the MCP server ships, the standalone CLI works identically — agents shell out to `branchnux` directly.

---

## gstack skill bundle (in design)

A `/branchnux` gstack skill is in design — will wrap the standalone CLI and add browser-coupled discovery (via `claude-in-chrome` MCP), multi-agent batch plan generation, and design-review enrichment loops. The standalone CLI remains the primary distribution path; gstack will be an optional integration for teams already using gstack.

---

## GRC platform compatibility

5-NUX produces artifacts that import into common GRC platforms. No native integrations exist; these are manual exports:

| Platform | Import method | Artifact |
|---|---|---|
| Vanta | Upload evidence ZIP | `evidence/*.png` + `execution-report.html` |
| Drata | Evidence upload | `execution-report.html` per control |
| ServiceNow GRC | CSV import | `test-plan.xlsx` (one row per TC) |
| Jira | Attachment or JSON import | `findings.json` (from `findings.schema.json`) |
| GovReady / RegScale / IBM OpenPages | OSCAL 1.1.2 JSON ingest | `branchnux sca-oscal <surface>` output |

The OSCAL 1.1.2 output is the canonical path for FedRAMP, SOC 2 examiners, and any GRC platform with NIST RFC-0024 support (mandatory September 2026).

---

## Questions?

Open a GitHub Discussion on the [`leapnux/5nux`](https://github.com/leapnux/5nux) repo. Tag with `integrations` for routing.
