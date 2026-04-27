# v0.3.0-alpha.1 — brand rename (trunknux → branchnux) + publish steps for you

**Date:** 2026-04-27
**Status:** Rename complete. `bin/trunknux.mjs` (disk file stays until you rename it), `package.json`, all source, docs, and templates updated.
Working tree dirty — **do not commit yet.** Follow the steps below in order.

## The BranchNuX rename — why

BranchNuX reframes the brand around its actual role in the 6-NUX framework: this tool is the *branch*, not the trunk.

The 6-NUX taxonomy: **rootnux** (requirements/specs) → **trunknux** (sprint-log/build) → **branchnux** (this tool — verification + evidence production) → **leafnux** (continuous health) → **fruitnux** (external audit deliverables) → **soilnux** (infra/ops). BranchNuX literally runs on a git branch, reads from rootnux and trunknux, verifies the branch's claims, and produces the leaves + fruits that the rest of the chain consumes.

The trunk fits the sprint-log better — it's the structural backbone of what was built. A testing tool is conventionally a branch: it runs on a git branch, verifies that branch's claims, and produces audit-ready evidence before merge. BranchNuX makes that positioning unambiguous.

## What changed in this rename (trunknux → branchnux)

| Item | Before | After |
|---|---|---|
| Binary filename (disk) | `bin/trunknux.mjs` | `bin/trunknux.mjs` (rename disk file manually — see Step 1) |
| npm package name | `trunknux` | `branchnux` |
| CLI command | `trunknux` | `branchnux` |
| `package.json` version | `0.2.2` | `0.3.0-alpha.1` |
| `package.json` bin key | `"trunknux": "bin/trunknux.mjs"` | `"branchnux": "bin/trunknux.mjs"` (bin path stays until disk rename) |
| Repository URLs | `StillNotBald/trunknux` | `StillNotBald/branchnux` |
| OSCAL namespace constant | `TRUNKNUX_OSCAL_NAMESPACE` | `BRANCHNUX_OSCAL_NAMESPACE` |
| Env var in docs | `TRUNKNUX_INDUSTRY` | `BRANCHNUX_INDUSTRY` |
| Brand prose | `TrunkNuX` | `BranchNuX` |
| Trademark form | `TrunkNuX™` | `BranchNuX™` |

**UUID preserved:** `BRANCHNUX_OSCAL_NAMESPACE` = `b0ab198a-bced-48a9-ae15-e5c4ca770a79` — unchanged. All previously-generated OSCAL documents remain valid.

## What you must do manually (in order)

### Step 1 — Rename the bin file on disk

The disk file `bin/trunknux.mjs` must be renamed to `bin/branchnux.mjs`, then update `package.json`'s bin entry to point to `bin/branchnux.mjs`. (Deferred in this automated pass to avoid Windows file-lock pain.)

```bash
mv bin/trunknux.mjs bin/branchnux.mjs
# Then in package.json, change: "branchnux": "bin/trunknux.mjs" → "branchnux": "bin/branchnux.mjs"
```

### Step 2 — Rename the GitHub repo

```bash
gh repo rename branchnux --repo StillNotBald/trunknux
```

GitHub will set up a redirect from the old URL automatically.

### Step 3 — Update your local git remote

```bash
git remote set-url origin https://github.com/StillNotBald/branchnux.git
git remote -v   # verify
```

### Step 4 — Create the signed commit

Stage everything and commit:

```bash
cd "C:/Users/Chu Ling/Desktop/Projects/testnux"
git add -A
git commit -S -m "chore: rename trunknux -> branchnux (v0.3.0-alpha.1)

Brand rename to align with 6-NUX framework positioning.
- package name: branchnux, version: 0.3.0-alpha.1
- bin: trunknux -> branchnux
- OSCAL namespace constant renamed; UUID preserved
- BRANCHNUX_INDUSTRY env var (was TRUNKNUX_INDUSTRY)
- All source, docs, templates, examples updated (1937 replacements)
- CLI surface unchanged"
```

### Step 5 — Tag and push v0.3.0-alpha.1

```bash
git tag -s v0.3.0-alpha.1 -m "v0.3.0-alpha.1 — Renamed to BranchNuX (6-NUX framework)"
git push origin main
git push origin v0.3.0-alpha.1
```

### Step 6 — Publish branchnux to npm

```bash
npm publish --tag alpha --otp=<6-digit-code>
```

This publishes `branchnux@0.3.0-alpha.1` on the `alpha` dist-tag. After publish, verify:

```bash
npm view branchnux version       # should return 0.3.0-alpha.1
npm view branchnux dist-tags     # should show { alpha: '0.3.0-alpha.1' }
```

### Step 7 — Deprecate the old trunknux package on npm

```bash
npm deprecate trunknux@* "Renamed to branchnux: npm install branchnux" --otp=<6-digit-code>
```

### Step 8 — Create the GitHub release

```bash
gh release create v0.3.0-alpha.1 \
  --title "v0.3.0-alpha.1 — Renamed to BranchNuX (6-NUX framework)" \
  --notes "Brand rename: trunknux -> branchnux. CLI surface unchanged. See CHANGELOG.md for full entry." \
  --prerelease
```

## Smoke test after publish

```bash
mkdir /tmp/branchnux-030-smoke && cd /tmp/branchnux-030-smoke
npm install branchnux@alpha
npx branchnux --version          # should print 0.3.0-alpha.1
npx branchnux --help | head -5   # should show "branchnux" and "BranchNuX"
npx branchnux demo --no-open
```

## Still on the to-do list (v0.2.x)

- Eval harness coverage expansion: 3 fixture pages today, target 10+ real customer pages
- gstack `/branchnux` skill bundle for the official catalog (planned v0.3)
- Industry pack additions: UK FCA, EU DORA, India RBI (planned v0.3+)
