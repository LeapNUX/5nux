# v0.2.1 — manual step for you

**Date:** 2026-04-27
**Status:** v0.2.1 stable is tagged on GitHub, marked Latest. Code, README, CHANGELOG, tests, lint all green. **Only one thing left: publish to npm.**

## TL;DR

- ✅ **Code:** v0.2.1 on `main`, 370/370 tests pass, 0 lint errors.
- ✅ **GitHub:** `v0.2.1` tagged + released, marked **Latest** (replaces v0.2.0 as the visible release).
- ✅ **What's in v0.2.1 vs v0.2.0:** wired `testnux demo` (was a stub), shipped `examples/` in the npm package, stripped stale alpha/stub tags from CLI help, plus 4 major-version dependency bumps verified safe (anthropic-sdk, marked, commander, eslint+@eslint/js).
- ⏳ **npm:** Currently `latest` = `0.1.1`, `alpha` = `0.2.0-alpha.1`. You need to publish `0.2.1` (needs OTP).

## What you need to do

### 1. Verify locally

```bash
cd "C:/Users/Chu Ling/Desktop/Projects/testnux"
git log --oneline -7              # should show v0.2.1 commits at top
git tag -l 'v0.2*'                 # should print v0.2.0, v0.2.0-alpha.1, v0.2.1
node bin/testnux.mjs --version     # should print "0.2.1"
node bin/testnux.mjs demo --no-open  # should print real demo info, not stub message
npm test                           # 370 passed
```

GitHub release page: <https://github.com/StillNotBald/testnux/releases/tag/v0.2.1>

### 2. Publish 0.2.1 to npm as `latest`

```bash
cd "C:/Users/Chu Ling/Desktop/Projects/testnux"
npm publish --otp=<6-digit-code-from-authenticator-or-recovery>
```

**Notes:**

- **No `--tag` flag.** Without it, npm publishes to the `latest` dist-tag (default behavior). This is what we want — `npm install testnux` (no tag) becomes 0.2.1.
- After publish: `npm view testnux version` should return `0.2.1` (was `0.1.1`).
- After publish: `npm view testnux dist-tags` should show `{ latest: '0.2.1', alpha: '0.2.0-alpha.1' }`.
- Note: **0.2.0 is intentionally skipped on npm**. v0.2.0 was tagged on GitHub but had three smoke-test polish issues (demo stub, missing examples in package, stale CLI tags) that were caught + fixed before publishing. v0.2.1 is the first 0.2.x version that goes to npm.

### 3. Smoke test before announcing (recommended)

```bash
mkdir /tmp/testnux-021-smoke && cd /tmp/testnux-021-smoke
npm install testnux           # no tag → gets 0.2.1
npx testnux --version         # should print 0.2.1
npx testnux demo --no-open    # should print path to bundled demo HTML (no longer a stub)
npx testnux init my-page --industry malaysia-banking
ls testing-log/               # should have 2026-04-27_my-page/
```

If anything breaks, you can publish a `0.2.2` patch quickly.

### 4. Optional: announce

- GitHub release page: <https://github.com/StillNotBald/testnux/releases/tag/v0.2.1>
- The README disclaimer block is intentionally prominent: "TestNUX automates the mechanics. Humans own the decisions."

## What's in v0.2.1

See [CHANGELOG.md](CHANGELOG.md) for the full diff. Highlights:

**Fixed (smoke-test polish caught after v0.2.0 was tagged):**
- `testnux demo` is now a real implementation. The v0.1 stub that printed "demo target is coming in the next release" is replaced with a cross-platform browser launcher that opens the bundled execution-report HTML (real `testnux report` output, 13 PASS / 2 BLOCKED-CONFIG, 13 embedded screenshots). New `--no-open` flag for CI.
- `examples/demo-dashboard/output/` now ships in the npm package (added to `package.json` `files`). Without this, README's "see it live" link was broken for npm-installed users.
- `[v0.2 ALPHA]` / `[v0.2 stub]` tags stripped from CLI descriptions for discover/plan/codify/enrich/batch-plan. Help text now matches the stable framing.

**Changed (dependency bumps, all verified safe by independent triage):**
- `@anthropic-ai/sdk` 0.39.0 → 0.91.1 (load-bearing for v0.2 LLM agents)
- `marked` 12.0.2 → 18.0.2 (HTML rendering — call sites use dynamic import)
- `commander` 12.1.0 → 14.0.3 (CLI flag parsing — no breakage in usage)
- `eslint` 9 → 10 + `@eslint/js` 9 → 10 (combined; flat-config drop-in)
- `sharp`, `actions/checkout`, `actions/setup-node` (CI hygiene)

**Tests:** 370/370 passing. 0 lint errors.

## Still on the to-do list (v0.2.x patch releases)

- Eval harness coverage expansion: 3 fixture pages today, target 10+ real customer pages
- gstack `/testnux` skill bundle for the official catalog (planned v0.3)
- Industry pack: `--industry malaysia-banking` already shipped in 0.2.0; potential additions in 0.3+ (UK FCA, EU DORA, India RBI)
