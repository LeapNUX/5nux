# @leapnux/6nux-core

Shared core for the 6-NUX product family — schemas, file conventions, validators, ID generators.

**Status:** v0.5.0-alpha.1 — **active**. Conventions, IDs, and utils API are stable. Schemas + validators are in design (versioned namespaces `schemas/v1/`, `schemas/v2/` so migrations stay clean).

**Audience:** Internal to LeapNuX `@leapnux/{rootnux,trunknux,branchnux,leafnux,fruitnux}` packages. End users typically don't import this directly — they install one of the NUX-suffixed packages.

**Contract stability:** Changes here are breaking changes for the entire 6-NUX family. Schema changes use versioned namespaces so migrations are clean.

## Modules

```js
import { PATHS, SCHEMAS, KEBAB_RE, DATE_SLUG_RE, VALID_DATE_RE, STATUSES } from '@leapnux/6nux-core/conventions'
import { RXX_PATTERN, todayISO, slugify, isValidSlug } from '@leapnux/6nux-core/ids'
import { parseMarkdownFrontmatter, yamlQuote, readFileWithSizeCap, assertDateFormat } from '@leapnux/6nux-core/utils'
// schemas + validators (in design — namespaces versioned for clean migration):
// import { rxxSchema, adrSchema } from '@leapnux/6nux-core/schemas/v1'
// import { validateRequirements, validateRTM } from '@leapnux/6nux-core/validators/v1'
```

See [`docs/6-NUX.md`](https://github.com/leapnux/5nux/blob/main/docs/6-NUX.md) for the artifact taxonomy this core implements and [`docs/ARCHITECTURE.md`](https://github.com/leapnux/5nux/blob/main/docs/ARCHITECTURE.md) for the implementation spec.

## License

Apache-2.0 (c) 2026 Chu Ling

## Part of the 5-NUX family

Sibling packages: [rootnux](https://www.npmjs.com/package/@leapnux/rootnux), [trunknux](https://www.npmjs.com/package/@leapnux/trunknux), [branchnux](https://www.npmjs.com/package/@leapnux/branchnux), [leafnux](https://www.npmjs.com/package/@leapnux/leafnux), [fruitnux](https://www.npmjs.com/package/@leapnux/fruitnux), [6nux-core](https://www.npmjs.com/package/@leapnux/6nux-core), [5nux meta](https://www.npmjs.com/package/@leapnux/5nux). See the [root README](https://github.com/leapnux/5nux#readme) for the full taxonomy and install instructions.
