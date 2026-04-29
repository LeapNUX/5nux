// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Shared Ajv-based validation engine.
//
// Compiles a JSON Schema Draft 2020-12 schema once and caches the result.
// All per-type validators delegate here so Ajv is only imported in one place.

import Ajv from 'ajv/dist/2020.js';

// One Ajv instance, shared across all compiled validators.
// strict: true is the Ajv 8 default and catches schema authoring mistakes.
const ajv = new Ajv({ strict: true, allErrors: true });

// Cache: schema $id → compiled validate function.
const cache = new Map();

/**
 * Compile a JSON Schema and return a cached validator.
 *
 * @param {object} schema  - JSON Schema Draft 2020-12 object (must have $id).
 * @returns {(data: unknown) => { valid: boolean, errors: Array<{path: string, message: string, value?: unknown}> }}
 */
export function compileValidator(schema) {
  const id = schema.$id;
  if (!id) throw new Error('Schema must have a $id to be cached.');

  if (!cache.has(id)) {
    const validateFn = ajv.compile(schema);
    cache.set(id, validateFn);
  }

  const validateFn = cache.get(id);

  return function validate(data) {
    const valid = validateFn(data);
    if (valid) return { valid: true, errors: [] };

    const errors = (validateFn.errors || []).map((e) => {
      const path = e.instancePath || '(root)';
      const message = e.message || 'validation error';
      // Include the offending value when it's scalar and not too large.
      let value;
      if (e.instancePath) {
        try {
          const parts = e.instancePath.replace(/^\//, '').split('/');
          let cur = data;
          for (const p of parts) cur = cur?.[p];
          if (cur !== null && typeof cur !== 'object') value = cur;
        } catch {
          // ignore — value stays undefined
        }
      }
      return value !== undefined ? { path, message, value } : { path, message };
    });

    return { valid: false, errors };
  };
}
