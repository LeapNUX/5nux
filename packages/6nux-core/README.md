# @leapnux/6nux-core

Shared core for the 6-NUX product family — schemas, file conventions, validators, ID generators.

**Status:** v0.6.0-alpha.1 — **active**. Conventions, IDs, utils API, schemas (v1), and validators are all stable and shipped.

**Audience:** Internal to LeapNuX `@leapnux/{rootnux,trunknux,branchnux,leafnux,fruitnux}` packages. End users typically don't import this directly — they install one of the NUX-suffixed packages.

**Contract stability:** Changes here are breaking changes for the entire 6-NUX family. Schema changes use versioned namespaces so migrations are clean.

## Modules

```js
import { PATHS, SCHEMAS, KEBAB_RE, DATE_SLUG_RE, VALID_DATE_RE, STATUSES } from '@leapnux/6nux-core/conventions'
import { RXX_PATTERN, todayISO, slugify, isValidSlug } from '@leapnux/6nux-core/ids'
import { parseMarkdownFrontmatter, yamlQuote, readFileWithSizeCap, assertDateFormat } from '@leapnux/6nux-core/utils'

// Validators — real Ajv-backed implementations (v0.6.0+):
import { validateRxx, validateAdr, validateSprintFolder, validateTestPlan, validateRtm } from '@leapnux/6nux-core'
// or via the subpath:
import { validateRxx } from '@leapnux/6nux-core/validators'

// Raw schema objects (for tooling, type generation, custom validators):
import { rxxSchema, adrSchema, sprintFolderSchema, testPlanSchema, rtmSchema } from '@leapnux/6nux-core/schemas/v1'
```

## Schemas + Validators (v0.6+)

Five JSON Schema Draft 2020-12 files live under `src/schemas/v1/`. All five have Ajv-backed validator functions.

### Validator return shape

Every validator returns `{ valid: boolean, errors: Array<{path, message, value?}> }`.

- `valid: true` → `errors` is always `[]`
- `valid: false` → `errors` contains normalized Ajv errors with a `path` (JSON Pointer like `/status`), a `message`, and an optional `value` for scalar mismatches

### Quick examples

```js
import { validateRxx, validateRtm } from '@leapnux/6nux-core';

// Valid:
validateRxx({ id: 'R-01', requirement: 'EPOD 8-module form', status: 'DONE' });
// → { valid: true, errors: [] }

// Invalid status (must be uppercase canonical):
validateRxx({ id: 'R-01', requirement: 'EPOD form', status: 'done' });
// → { valid: false, errors: [{ path: '/status', message: 'must be equal to one of the allowed values', value: 'done' }] }

// Bad R-ID (4 digits, exceeds range):
validateRxx({ id: 'R-1234', requirement: 'EPOD form', status: 'DONE' });
// → { valid: false, errors: [{ path: '/id', message: 'must match pattern "^R-\\d{1,3}[a-z]?$"', value: 'R-1234' }] }

// Folder-based validators read the filesystem:
import { validateSprintFolder } from '@leapnux/6nux-core';
validateSprintFolder('/path/to/sprint-log/2026-04-21_sprint1-2-epod-sol');
// → { valid: true, errors: [] }  (if SPRINT_SUMMARY.md exists)
```

See `src/schemas/v1/README.md` for the full status enum, R-ID format rules, and version policy.

See [`docs/6-NUX.md`](https://github.com/leapnux/5nux/blob/main/docs/6-NUX.md) for the artifact taxonomy this core implements and [`docs/ARCHITECTURE.md`](https://github.com/leapnux/5nux/blob/main/docs/ARCHITECTURE.md) for the implementation spec.

## License

Apache-2.0 (c) 2026 Chu Ling

## Part of the 5-NUX family

Sibling packages: [rootnux](https://www.npmjs.com/package/@leapnux/rootnux), [trunknux](https://www.npmjs.com/package/@leapnux/trunknux), [branchnux](https://www.npmjs.com/package/@leapnux/branchnux), [leafnux](https://www.npmjs.com/package/@leapnux/leafnux), [fruitnux](https://www.npmjs.com/package/@leapnux/fruitnux), [6nux-core](https://www.npmjs.com/package/@leapnux/6nux-core), [5nux meta](https://www.npmjs.com/package/@leapnux/5nux). See the [root README](https://github.com/leapnux/5nux#readme) for the full taxonomy and install instructions.
