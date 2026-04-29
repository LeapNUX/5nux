// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Named schema object exports for @leapnux/6nux-core/schemas/v1.
//
// Useful for tooling that needs the raw JSON Schema objects (e.g. to render
// documentation, generate TypeScript types, or pass to a custom validator).
//
// Usage:
//   import { rxxSchema, adrSchema } from '@leapnux/6nux-core/schemas/v1'

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const rxxSchema = require('./rxx.schema.json');
export const adrSchema = require('./adr.schema.json');
export const sprintFolderSchema = require('./sprint-folder.schema.json');
export const testPlanSchema = require('./test-plan.schema.json');
export const rtmSchema = require('./rtm.schema.json');
