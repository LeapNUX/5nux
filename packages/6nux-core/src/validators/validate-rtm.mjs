// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Validator for RTM (TRACEABILITY.md) rows (rtm.schema.json v1).

import { createRequire } from 'node:module';
import { compileValidator } from './_engine.mjs';

const require = createRequire(import.meta.url);
const schema = require('../schemas/v1/rtm.schema.json');

const _validate = compileValidator(schema);

/**
 * Validate an RTM row object.
 *
 * @param {object} obj - Object to validate. Expected shape:
 *   { id: string, title: string, status: string,
 *     sprint?: string, code?: string, tests?: string, backlog?: string, notes?: string }
 * @returns {{ valid: boolean, errors: Array<{path: string, message: string, value?: unknown}> }}
 */
export function validateRtm(obj) {
  return _validate(obj);
}
