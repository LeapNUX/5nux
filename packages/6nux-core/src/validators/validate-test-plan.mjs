// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Validator for testing-log folder + test-plan.md structure (test-plan.schema.json v1).
//
// Accepts a folder PATH. Reads test-plan.md (if present) to extract the route
// and TC count, then validates the resulting object against the test-plan schema.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { compileValidator } from './_engine.mjs';
import { DATE_SLUG_RE } from '../conventions.mjs';

const require = createRequire(import.meta.url);
const schema = require('../schemas/v1/test-plan.schema.json');

const _validate = compileValidator(schema);

/**
 * Extract the route from test-plan.md content.
 * Looks for a line matching: **Route:** /some/path
 */
function extractRoute(content) {
  const m = content.match(/^\*\*Route:\*\*\s*(.+)$/m);
  return m ? m[1].trim() : undefined;
}

/**
 * Count TC rows in the Test Case Matrix table.
 * Counts lines that start with | and contain a TC-ID pattern (like LOGIN-01, TRUNK-01).
 */
function countTCs(content) {
  const lines = content.split('\n');
  let count = 0;
  let inMatrix = false;
  for (const line of lines) {
    if (/##\s+Test Case Matrix/i.test(line)) { inMatrix = true; continue; }
    if (inMatrix && /^##/.test(line)) break; // next section
    if (inMatrix && /^\|[^-]/.test(line) && !/^\|\s*TC\s*ID/i.test(line)) {
      count++;
    }
  }
  return count;
}

/**
 * Validate a testing-log folder.
 *
 * @param {string} folderPath - Absolute or relative path to the testing-log folder.
 *   The folder name must match the date-slug convention.
 * @returns {{ valid: boolean, errors: Array<{path: string, message: string, value?: unknown}> }}
 */
export function validateTestPlan(folderPath) {
  const folderName = path.basename(folderPath);
  const match = DATE_SLUG_RE.exec(folderName);

  if (!match) {
    return {
      valid: false,
      errors: [{ path: '(root)', message: `Folder name "${folderName}" does not match date-slug convention YYYY-MM-DD_<slug>` }],
    };
  }

  const date = match[1];
  const slug = match[2];

  const planPath = path.join(folderPath, 'test-plan.md');
  const hasPlan = fs.existsSync(planPath);

  let route;
  let tcCount = 0;
  if (hasPlan) {
    try {
      const content = fs.readFileSync(planPath, 'utf-8');
      route = extractRoute(content);
      tcCount = countTCs(content);
    } catch {
      // ignore read errors; route stays undefined
    }
  }

  if (!route) {
    return {
      valid: false,
      errors: [{ path: '/route', message: 'Could not extract **Route:** from test-plan.md (missing or malformed)' }],
    };
  }

  const obj = { folderName, date, slug, route, hasPlan, tcCount };

  return _validate(obj);
}
