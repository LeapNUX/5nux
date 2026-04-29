# 6nux-core Schemas v1

JSON Schema Draft 2020-12 definitions for 6-NUX artifact types. These are the canonical schemas that all `@leapnux/*` packages use to validate their inputs.

## Schemas

| File | Validates | Key fields |
|---|---|---|
| `rxx.schema.json` | R-XX requirement rows (from REQUIREMENTS.md) | `id` (R-ID pattern), `requirement`, `status` (8-value enum), `notes` |
| `adr.schema.json` | ADR document frontmatter + structure | `id` (4-digit), `title`, `status` (Proposed/Accepted/Rejected/Superseded/Deprecated), `date` |
| `sprint-folder.schema.json` | sprint-log folder metadata | `folderName` (date-slug pattern), `date`, `slug`, `hasSummary` |
| `test-plan.schema.json` | testing-log folder + test-plan.md | `folderName`, `date`, `slug`, `route`, `hasPlan`, `tcCount` |
| `rtm.schema.json` | TRACEABILITY.md RTM rows | `id` (R-ID), `title`, `status`, `sprint`, `code`, `tests`, `backlog`, `notes` |

## Status enum (shared by rxx + rtm)

The 8 canonical statuses (case-sensitive, uppercase):

| Status | Meaning |
|---|---|
| `DONE` | Implemented, tested, and verified |
| `PARTIAL` | Partially implemented — work remaining |
| `BLOCKED` | Blocked on internal dependency or decision |
| `BLOCKED-EXTERNAL` | Blocked on vendor, regulator, or third party |
| `NOT STARTED` | In scope but no implementation begun |
| `DECLINED` | Descoped or rejected — will not be implemented |
| `DEFERRED` | Postponed to a future milestone |
| `FAKE` | UI stub — backend is animation or placeholder |

`BLOCKED-EXTERNAL` is distinct from `BLOCKED` — use it when the next move belongs to an external party, not engineering. See `docs/format-contract.md` Section 4 for the full normalization rules applied before validation.

## R-ID format

Pattern: `^R-\d{1,3}[a-z]?$`

Valid: `R-1`, `R-12`, `R-98a`, `R-102`
Invalid: `R-1234` (4 digits), `R-1A` (uppercase suffix), `FE-01` (non-R prefix)

## Version policy

- **Non-breaking additions** (new optional property, extending an enum) → stay in `v1/`. Update the schema `$id` description but not the path.
- **Breaking changes** (removing a property, narrowing a type, changing a required field) → create `v2/` alongside `v1/`. Both are published; consumers migrate at their own pace. A migration note is added to `CHANGELOG.md`.

The `$id` for all v1 schemas is `https://schemas.leapnux.com/v1/<name>.schema.json`. These URLs are stable identifiers — the schemas are not served from this URL yet (PP-F11 is a known gap; a future `@leapnux/schema-registry` package will serve them at this URL).

## Usage

```js
// Import schemas as objects (for tooling, documentation, type generation):
import { rxxSchema, adrSchema, rtmSchema } from '@leapnux/6nux-core/schemas/v1';

// Use the pre-compiled validators (recommended for validation tasks):
import { validateRxx, validateRtm } from '@leapnux/6nux-core';

const result = validateRxx({ id: 'R-01', requirement: 'EPOD form', status: 'DONE' });
// { valid: true, errors: [] }

const fail = validateRxx({ id: 'R-01', requirement: 'EPOD form', status: 'done' });
// { valid: false, errors: [{ path: '/status', message: 'must be equal to one of the allowed values', value: 'done' }] }
```
