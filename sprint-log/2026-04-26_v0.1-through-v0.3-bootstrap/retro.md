# Retrospective — v0.1 → v0.3 bootstrap

**Date:** 2026-04-26
**Duration:** ~2 hours
**Format:** Solo sprint with multi-agent dispatch

---

## What went well

- Multi-agent dispatch produced all 13 file groups in parallel without conflict (no overlapping
  output paths across agents)
- Stub pattern with embedded prompt templates means v0.2 agent work is mechanical — no design
  decisions deferred to v0.2
- JSON config for industry standards was the right call: contributors can add a new bundle
  without touching core code
- xffForTest helper in spec.ts template captures a real empirical lesson (validated tonight)
  and ships it as a default, not an afterthought

## What to improve

- No unit tests written in this sprint; testing-hub tests itself via the self-test pass
  (testing-log/2026-04-26_self-test/) but src/ has zero Jest coverage at v0.0.1 — high
  priority for v0.1 release
- The OSCAL library (src/lib/oscal.mjs) is fully implemented but the CLI command
  (sca oscal) is a stub; the wiring should have landed in the same sprint
- requirements/ folder for testing-hub itself does not exist yet — the self-test plan
  references R-IDs that are defined only in SPRINT_SUMMARY.md, not in a canonical
  REQUIREMENTS.md. Must be fixed before v0.1 launch.

## Process notes

- Multi-agent worktree isolation is unreliable on Windows; all agents wrote to the same
  working tree. Agents were given non-overlapping file paths to avoid merge conflicts.
- Agents don't auto-commit — all files were reviewed and committed in a single scaffold commit.
- The "stub vs real" split worked as designed: deterministic logic (parser, graph, RTM
  walker, OSCAL emit, UAT chain) is fully implemented; LLM-touching logic is stub with
  full prompt templates in comments.

## Next sprint priorities

1. Write requirements/REQUIREMENTS.md for testing-hub itself (so R-IDs used in testing
   are canonical, not just narrative)
2. Add Jest unit tests for src/lib/{parser, graph, oscal, uat-log}.mjs
3. Implement `sca oscal` command wiring (lib is ready; command just needs I/O plumbing)
4. Flip repo to public + post v0.1 launch announcement
5. Real implementation for `discover` + `plan` (needs CLAUDE_API_KEY integration)
