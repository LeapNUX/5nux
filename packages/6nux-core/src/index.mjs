// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0
// @leapnux/6nux-core — shared core for the 6-NUX product family
//
// Status: shared utilities populated as of v0.4.2-alpha.1 (conventions, ids, utils).
// Validators + schemas remain placeholders pending v0.6.0+. See docs/ARCHITECTURE.md.
//
// AP-F2 (audit ref: docs/audit/2026-04-28/SYNTHESIS-5nux.md):
// schemas.mjs previously exported 5 null symbols (rxxSchema, adrSchema,
// sprintFolderSchema, testPlanSchema, rtmSchema). These have been removed from
// the barrel — null schema exports masked missing implementations and could cause
// consumers to silently skip validation. Schemas ship in v0.6.0+ under schemas/v1/.

export const VERSION = '0.6.0-alpha.1';
export const STATUS = 'active';

export * from './conventions.mjs';
// schemas.mjs (legacy stub) intentionally NOT re-exported.
// Real schemas live under schemas/v1/ and are importable via:
//   import { rxxSchema, adrSchema, ... } from '@leapnux/6nux-core/schemas/v1'
export * from './ids.mjs';
export * from './utils.mjs';

// Validators — real Ajv-backed implementations shipped in v0.6.0+ (AP-F2 closed).
// Also importable as: import { validateRxx } from '@leapnux/6nux-core/validators'
export { validateRxx } from './validators/validate-rxx.mjs';
export { validateAdr } from './validators/validate-adr.mjs';
export { validateSprintFolder } from './validators/validate-sprint-folder.mjs';
export { validateTestPlan } from './validators/validate-test-plan.mjs';
export { validateRtm } from './validators/validate-rtm.mjs';
