// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Validator for R-XX requirement rows (rxx.schema.json v1).

import { createRequire } from 'node:module';
import { compileValidator } from './_engine.mjs';

const require = createRequire(import.meta.url);
const schema = require('../schemas/v1/rxx.schema.json');

const _validate = compileValidator(schema);

/**
 * Validate an R-XX requirement row object.
 *
 * @param {object} obj - Object to validate. Expected shape:
 *   { id: string, requirement: string, status: string, notes?: string }
 * @returns {{ valid: boolean, errors: Array<{path: string, message: string, value?: unknown}> }}
 */
export function validateRxx(obj) {
  return _validate(obj);
}
