// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Validator for sprint-log folder structure (sprint-folder.schema.json v1).
//
// Accepts a folder PATH. Reads the folder contents via node:fs to determine
// whether SPRINT_SUMMARY.md exists and extract its title, then validates the
// resulting object against the sprint-folder schema.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { compileValidator } from './_engine.mjs';
import { DATE_SLUG_RE } from '../conventions.mjs';

const require = createRequire(import.meta.url);
const schema = require('../schemas/v1/sprint-folder.schema.json');

const _validate = compileValidator(schema);

/**
 * Validate a sprint-log folder.
 *
 * @param {string} folderPath - Absolute or relative path to the sprint folder.
 *   The folder name must match the date-slug convention.
 * @returns {{ valid: boolean, errors: Array<{path: string, message: string, value?: unknown}> }}
 */
export function validateSprintFolder(folderPath) {
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

  const summaryPath = path.join(folderPath, 'SPRINT_SUMMARY.md');
  const hasSummary = fs.existsSync(summaryPath);

  let summaryTitle;
  if (hasSummary) {
    try {
      const content = fs.readFileSync(summaryPath, 'utf-8');
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) summaryTitle = titleMatch[1].trim();
    } catch {
      // file readable check already done via existsSync; ignore read errors
    }
  }

  const obj = { folderName, date, slug, hasSummary };
  if (summaryTitle) obj.summaryTitle = summaryTitle;

  const result = _validate(obj);

  // Additional semantic check: SPRINT_SUMMARY.md must exist.
  if (result.valid && !hasSummary) {
    return {
      valid: false,
      errors: [{ path: '/hasSummary', message: 'SPRINT_SUMMARY.md not found in sprint folder' }],
    };
  }

  return result;
}
