# v0.2.2 — brand rename + publish steps for you

**Date:** 2026-04-27
**Status:** Rename complete. `bin/trunknux.mjs`, `package.json`, all source, docs, and templates updated.
370/370 tests pass. 0 lint errors. Working tree dirty — **do not commit yet.** Follow the steps below in order.

## The TrunkNuX rename — why

TrunkNuX reframes the brand around its foundational purpose: the trunk of the Yggdrasil tree.

The testing-to-audit journey — test plan → execution log → RTM → SCA → OSCAL → sign-off — is the **trunk**: the structural core that holds everything together and that every branch must pass through. From that trunk, new artifact verbs grow as branches: `attest`, `comply`, `respond`, each connecting a different stakeholder (compliance officer, auditor, regulator, vendor-DD team) back to the same evidence spine.

Eventually the trunk becomes a world-tree: a single evidence chain connecting engineering, compliance, audit, regulator, and vendor due-diligence across firm sizes. The name carries that architecture forward.

## What changed in this rename

| Item | Before | After |
|---|---|---|
| Binary filename | `bin/testnux.mjs` | `bin/trunknux.mjs` |
| npm package name | `testnux` | `trunknux` |
| CLI command | `testnux` | `trunknux` |
| `package.json` version | `0.2.1` | `0.2.2` |
| `package.json` bin | `"testnux": "bin/testnux.mjs"` | `"trunknux": "bin/trunknux.mjs"` |
| Repository URLs | `StillNotBald/testnux` | `StillNotBald/trunknux` |
| OSCAL namespace constant | `TESTNUX_OSCAL_NAMESPACE` | `TRUNKNUX_OSCAL_NAMESPACE` |
| Env var in docs | `TESTNUX_INDUSTRY` | `TRUNKNUX_INDUSTRY` |
| Brand prose | `TestNUX` | `TrunkNuX` |
| Trademark form | `TestNUX™` | `TrunkNuX™` |

**UUID preserved:** `TRUNKNUX_OSCAL_NAMESPACE` = `b0ab198a-bced-48a9-ae15-e5c4ca770a79` — unchanged. All previously-generated OSCAL documents remain valid.

## What you must do manually (in order)

### Step 1 — Update CHANGELOG.md

Add a new `[0.2.2]` entry at the top of the releases section. Suggested text:

```markdown
## [0.2.2] — 2026-04-27

### Changed
- **Brand rename: TestNUX → TrunkNuX.** The package is now published as `trunknux`;
  the CLI command is `trunknux`. All source, docs, and templates updated.
- Binary renamed from `bin/testnux.mjs` to `bin/trunknux.mjs`.
- OSCAL namespace constant renamed `TESTNUX_OSCAL_NAMESPACE` → `TRUNKNUX_OSCAL_NAMESPACE`
  (UUID value unchanged — all previously-issued OSCAL records remain valid).
- `TESTNUX_INDUSTRY` env var renamed `TRUNKNUX_INDUSTRY` in docs.
- Version bump to 0.2.2 (rename-only patch; no functional changes).

### Notes
- Historical npm package `testnux` will be deprecated pointing to `trunknux`.
- CHANGELOG.md historical entries (v0.1.x–v0.2.1) are intentionally left with
  the old name — they accurately describe what shipped under that name.
```

### Step 2 — Rename the GitHub repo

```bash
gh repo rename trunknux --repo StillNotBald/testnux
```

GitHub will set up a redirect from the old URL automatically.

### Step 3 — Update your local git remote

```bash
git remote set-url origin https://github.com/StillNotBald/trunknux.git
git remote -v   # verify
```

### Step 4 — Create the signed commit

Stage everything and commit:

```bash
cd "C:/Users/Chu Ling/Desktop/Projects/testnux"
git add -A
git commit -S -m "chore: rename testnux → trunknux (v0.2.2)

Brand rename only. No functional changes.
- bin/trunknux.mjs (was bin/testnux.mjs)
- package name: trunknux, version: 0.2.2
- OSCAL namespace constant renamed; UUID preserved
- TRUNKNUX_INDUSTRY env var (was TESTNUX_INDUSTRY)
- All source, docs, templates, examples updated"
```

### Step 5 — Tag and push v0.2.2

```bash
git tag -s v0.2.2 -m "v0.2.2 — Renamed to TrunkNuX"
git push origin main
git push origin v0.2.2
```

### Step 6 — Publish trunknux to npm

```bash
npm publish --otp=<6-digit-code>
```

This publishes `trunknux@0.2.2` as `latest`. After publish, verify:

```bash
npm view trunknux version       # should return 0.2.2
npm view trunknux dist-tags     # should show { latest: '0.2.2' }
```

### Step 7 — Deprecate the old testnux package on npm

```bash
npm deprecate testnux@* "Renamed to trunknux: npm install trunknux" --otp=<6-digit-code>
```

This leaves the old package installable but warns users to migrate.

### Step 8 — Create the GitHub release

```bash
gh release create v0.2.2 \
  --title "v0.2.2 — Renamed to TrunkNuX" \
  --notes "Brand rename: testnux → trunknux. No functional changes. See CHANGELOG.md for full entry." \
  --latest
```

## Smoke test after publish

```bash
mkdir /tmp/trunknux-022-smoke && cd /tmp/trunknux-022-smoke
npm install trunknux
npx trunknux --version          # should print 0.2.2
npx trunknux --help | head -5   # should show "trunknux" and "TrunkNuX"
npx trunknux demo --no-open
```

## Still on the to-do list (v0.2.x)

- Eval harness coverage expansion: 3 fixture pages today, target 10+ real customer pages
- gstack `/trunknux` skill bundle for the official catalog (planned v0.3)
- Industry pack additions: UK FCA, EU DORA, India RBI (planned v0.3+)
