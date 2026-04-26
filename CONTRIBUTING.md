# Contributing to Testing Hub™

Thank you for contributing. A few rules keep the project reliable and audit-defensible.

---

## DCO — Developer Certificate of Origin

Testing Hub uses DCO instead of a CLA. This means you attest that your contribution is your own work (or that you have the right to submit it) by signing off every commit:

```bash
git commit -s -m "feat: add validate command"
```

The `-s` flag appends a `Signed-off-by: Your Name <you@example.com>` line. Every commit in every PR must carry this. The DCO GitHub Action enforces it automatically — PRs with unsigned commits cannot merge.

The full DCO text is at https://developercertificate.org.

---

## Dev environment setup

**Requirements:** Node 20+, npm 9+

```bash
git clone https://github.com/StillNotBald/testing-hub.git
cd testing-hub
npm install
npm test          # unit tests
npm run build     # compile src/ → dist/
npm run lint      # ESLint + Prettier check
npm run lint:fix  # auto-fix formatting
```

To smoke-test the CLI locally before pushing:

```bash
node bin/testing-hub.mjs doctor
node bin/testing-hub.mjs demo
```

---

## Testing requirement

Every PR must ship with tests. This is not negotiable.

- New commands → integration test in `test/commands/`
- New parsers or renderers → unit test in `test/unit/`
- Bug fixes → a regression test that would have caught the bug

Run the full suite before opening a PR:

```bash
npm test
```

If you are adding a Playwright-based fixture, also run:

```bash
npm run test:e2e
```

---

## Code style

ESLint + Prettier are configured in the repo. The CI lint step fails on any violation.

```bash
npm run lint        # check only
npm run lint:fix    # auto-fix
```

Key rules:
- Apache 2.0 SPDX header on every new source file: `// Copyright 2026 Chu Ling\n// SPDX-License-Identifier: Apache-2.0`
- ESM throughout (`import`/`export`, `.mjs` for CLI entry points)
- No default exports in library code
- Prefer explicit error messages over silent failures

---

## PR process

1. Open an issue first for any non-trivial change (new command, changed data model, new standard). Align on design before writing code.
2. Branch off `main`: `git checkout -b feat/my-feature`
3. Keep PRs focused — one feature or fix per PR.
4. Sign off every commit (`git commit -s`).
5. Fill in the PR template (summary, test plan, affected commands).
6. CI must be green before review.
7. At least one maintainer review required to merge.

---

## Labeling convention

| Label | Meaning |
|---|---|
| `good first issue` | Self-contained, well-scoped, no architectural decisions needed |
| `needs-design` | Requires discussion before implementation |
| `v0.2` / `v0.3` | Scoped to a future milestone, not accepting PRs yet |
| `bug` | Reproducible defect with a test case |
| `standards-content` | Changes to industry standards mappings in `templates/industry/` |
| `breaking` | Changes that alter CLI flags, output format, or frontmatter schema |

---

## Evidence-driven contribution guidance

These lessons come from real production use of the pipeline. Each one became a rule because the opposite burned time or broke something in practice.

- **Write to `execution-log-auto.md`, never `execution-log.md`.** A 159-line curated narrative was overwritten by a spec's `afterAll` hook. The `-auto` suffix is how the CLI knows which file it owns.
- **Test against `npm run build && npm start`, not `npm run dev`.** Hydration race conditions in dev mode cause spurious failures in form-submit tests.
- **Use `form.requestSubmit()` in Playwright, not `button.click()`.** React's synthetic event system requires `requestSubmit` to fire validation; `click` can fire before the handler attaches.
- **Rate-limit and lockout tests must run last.** Tests that trigger lockouts or exhaust rate buckets pollute subsequent tests. Annotate them with `// @rate-limit-test`; the lint rule moves them to end-of-file.
- **Per-test `X-Forwarded-For` headers isolate rate-limit buckets.** Sequential auth tests share a rate-limit bucket and trigger 429s. The spec template auto-generates `X-Forwarded-For: 10.0.0.<test-index>` per test.
- **Seed scripts must preserve secrets on partial failure.** Never null-out a known-good secret on enrollment failure. Read existing fixtures and merge results.
- **BLOCKED-IMPLEMENTATION and BLOCKED-CONFIG are first-class statuses.** Flag TCs as blocked rather than hiding them when the underlying feature is a stub or undeployed.
- **Append-only enrichment.** When enriching an existing test plan, append new sections. Never rewrite existing content.
- **One agent per slug.** When running parallel agents, never have two agents touch the same test-plan file.

---

## Questions

Open a GitHub Discussion if you're not sure whether something is in scope or how to approach a change. Issues are for bugs and confirmed feature requests.
