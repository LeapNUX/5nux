// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Validator for ADR document objects (adr.schema.json v1).

import { createRequire } from 'node:module';
import { compileValidator } from './_engine.mjs';

const require = createRequire(import.meta.url);
const schema = require('../schemas/v1/adr.schema.json');

const _validate = compileValidator(schema);

/**
 * Validate an ADR document object.
 *
 * @param {object} obj - Object to validate. Expected shape:
 *   { id: string, title: string, status: string, date: string,
 *     context?: string, decision?: string, consequences?: string, supersededBy?: string }
 * @returns {{ valid: boolean, errors: Array<{path: string, message: string, value?: unknown}> }}
 */
export function validateAdr(obj) {
  return _validate(obj);
}
