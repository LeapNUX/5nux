// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * src/commands/risk-add.mjs
 *
 * Implements `rootnux risk-add`.
 *
 * Appends a templated row to requirements/risks/risks.md.
 * Auto-increments Risk ID by scanning existing rows for R-NN patterns.
 *
 * Exit codes:
 *   0 — row appended
 *   1 — register full at R-99, or write error
 *   2 — risks.md does not exist (run rootnux init first)
 */

import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '@leapnux/6nux-core/conventions';

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * @param {{ cwd?: string }} opts
 * @returns {Promise<number>} exit code
 */
export async function runRiskAdd(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  const risksPath = path.join(cwd, PATHS.risks);

  // ── Existence check ───────────────────────────────────────────────────────

  if (!fs.existsSync(risksPath)) {
    console.error('ERROR: requirements/risks/risks.md not found.');
    console.error('       Run `rootnux init` first to scaffold the risk register.');
    return 2;
  }

  // ── Determine next Risk ID ────────────────────────────────────────────────

  const content = fs.readFileSync(risksPath, 'utf-8');
  const riskIdMatches = [...content.matchAll(/\bR-(\d+)\b/g)];

  let highest = 0;
  for (const m of riskIdMatches) {
    const num = parseInt(m[1], 10);
    if (num > highest) highest = num;
  }

  // ── Overflow guard (ARCH F-05) ────────────────────────────────────────────

  if (highest >= 99) {
    console.error('ERROR: risk register full at R-99 — consider archiving old risks before adding new ones.');
    return 1;
  }

  const next = highest + 1;
  const riskId = `R-${String(next).padStart(2, '0')}`;

  // ── Build new row ─────────────────────────────────────────────────────────

  const newRow = `| ${riskId} | <DOMAIN> | <RISK DESCRIPTION> | MED | OPEN |`;

  // ── Append to file ────────────────────────────────────────────────────────

  // Ensure file ends with a newline before appending
  const sep = content.endsWith('\n') ? '' : '\n';
  try {
    fs.appendFileSync(risksPath, `${sep}${newRow}\n`, 'utf-8');
  } catch (err) {
    console.error(`ERROR: could not write to risks.md: ${err.message}`);
    return 1;
  }

  console.log(`Appended: ${newRow}`);
  console.log('');
  console.log('Edit requirements/risks/risks.md to fill in details.');

  return 0;
}
