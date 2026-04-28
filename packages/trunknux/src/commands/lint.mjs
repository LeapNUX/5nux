// trunknux lint
// Validates sprint folder naming conventions and README structure.

import fs from 'node:fs';
import path from 'node:path';
import { DATE_SLUG_RE, KEBAB_RE } from '@leapnux/6nux-core/conventions';
import { readFileWithSizeCap } from '@leapnux/6nux-core/utils';

const YEAR_RE = /^(19|20)\d{2}$/;

// Maximum sprint folders before emitting a warning (SEC F-07 / ARCH guard)
const MAX_SPRINT_FOLDERS = 1000;

function isValidDate(dateStr) {
  // Must be YYYY-MM-DD with year in 1900-2099
  const parts = dateStr.split('-');
  if (parts.length !== 3) return false;
  const [y, m, d] = parts;
  if (!YEAR_RE.test(y)) return false;
  const date = new Date(`${dateStr}T00:00:00Z`);
  return (
    !isNaN(date.getTime()) &&
    date.getUTCFullYear() === Number(y) &&
    date.getUTCMonth() + 1 === Number(m) &&
    date.getUTCDate() === Number(d)
  );
}

function parseFrontmatter(content) {
  // Detect YAML frontmatter: starts with ---\n
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
  if (!match) return null;
  const raw = match[1];
  const keys = {};
  for (const line of raw.split('\n')) {
    const kv = /^(\w+):\s*(.*)/.exec(line.trim());
    if (kv) keys[kv[1]] = kv[2].trim();
  }
  return keys;
}

/**
 * @param {{ json?: boolean, cwd?: string }} opts
 */
export function lint(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  const sprintLogDir = path.join(cwd, 'sprint-log');

  if (!fs.existsSync(sprintLogDir)) {
    const msg =
      'No sprint-log directory found. Run `trunknux new-sprint <slug>` to create the first sprint.';
    if (opts.json) {
      console.log(JSON.stringify({ ok: false, errors: [{ type: 'no-sprint-log', message: msg }] }));
    } else {
      console.error(msg);
    }
    process.exit(2);
  }

  const entries = fs
    .readdirSync(sprintLogDir)
    .filter((name) => {
      const full = path.join(sprintLogDir, name);
      return fs.statSync(full).isDirectory();
    });

  if (entries.length === 0) {
    const result = { ok: true, checked: 0, errors: [], warnings: [] };
    if (opts.json) {
      console.log(JSON.stringify(result));
    } else {
      console.log('sprint-log/ is empty — nothing to lint.');
    }
    process.exit(0);
  }

  const results = [];
  let hasError = false;
  const topLevelWarnings = [];

  // Cap at MAX_SPRINT_FOLDERS (SEC F-07)
  let entriesToCheck = entries;
  if (entries.length > MAX_SPRINT_FOLDERS) {
    topLevelWarnings.push(
      `sprint-log/ has ${entries.length} folders — only first ${MAX_SPRINT_FOLDERS} checked (cap). Consider archiving old sprints.`
    );
    entriesToCheck = entries.sort().slice(0, MAX_SPRINT_FOLDERS);
  }

  for (const name of entriesToCheck.sort()) {
    const folderResult = {
      folder: name,
      errors: [],
      warnings: [],
    };

    const m = DATE_SLUG_RE.exec(name);
    if (!m) {
      folderResult.errors.push({
        type: 'invalid-folder-name',
        message: `Folder "${name}" does not match <YYYY-MM-DD>_<slug> pattern.`,
      });
      hasError = true;
    } else {
      const [, dateStr, slug] = m;

      if (!isValidDate(dateStr)) {
        folderResult.errors.push({
          type: 'invalid-date',
          message: `Folder "${name}" has invalid date "${dateStr}".`,
        });
        hasError = true;
      }

      if (!KEBAB_RE.test(slug)) {
        folderResult.errors.push({
          type: 'invalid-slug',
          message: `Folder "${name}" has invalid slug "${slug}" (must be kebab-case).`,
        });
        hasError = true;
      }
    }

    // Check README.md exists
    const readmePath = path.join(sprintLogDir, name, 'README.md');
    if (!fs.existsSync(readmePath)) {
      folderResult.errors.push({
        type: 'missing-readme',
        message: `Folder "${name}" is missing README.md.`,
      });
      hasError = true;
    } else {
      // Read with size cap (SEC F-07)
      let content;
      try {
        content = readFileWithSizeCap(readmePath);
      } catch (err) {
        if (err.code === 'EFILETOOLARGE') {
          folderResult.warnings.push({
            type: 'file-too-large',
            message: `README.md in "${name}" is too large to lint (${err.message}).`,
          });
          results.push(folderResult);
          continue;
        }
        throw err;
      }

      // Check frontmatter
      const fm = parseFrontmatter(content);
      if (!fm) {
        folderResult.warnings.push({
          type: 'missing-frontmatter',
          message: `README.md in "${name}" has no YAML frontmatter.`,
        });
      } else {
        if (!fm.sprint) {
          folderResult.warnings.push({
            type: 'missing-frontmatter-sprint',
            message: `README.md in "${name}" frontmatter is missing "sprint:" key.`,
          });
        }
        if (!fm.date) {
          folderResult.warnings.push({
            type: 'missing-frontmatter-date',
            message: `README.md in "${name}" frontmatter is missing "date:" key.`,
          });
        }
      }
    }

    results.push(folderResult);
  }

  if (opts.json) {
    const allErrors = results.flatMap((r) => r.errors);
    const allWarnings = [
      ...topLevelWarnings.map(m => ({ type: 'folder-cap', message: m })),
      ...results.flatMap((r) => r.warnings),
    ];
    console.log(
      JSON.stringify({
        ok: !hasError,
        checked: results.length,
        errors: allErrors,
        warnings: allWarnings,
        folders: results,
      },
      null,
      2
    ));
  } else {
    for (const w of topLevelWarnings) {
      console.warn(`WARN    ${w}`);
    }
    for (const r of results) {
      for (const e of r.errors) {
        console.error(`ERROR   ${e.message}`);
      }
      for (const w of r.warnings) {
        console.warn(`WARN    ${w.message}`);
      }
    }
    if (!hasError) {
      const totalWarnings = topLevelWarnings.length + results.reduce((s, r) => s + r.warnings.length, 0);
      console.log(
        `OK — ${results.length} sprint folder(s) checked, 0 errors` +
          (totalWarnings ? `, ${totalWarnings} warning(s)` : '') +
          '.'
      );
    }
  }

  process.exit(hasError ? 1 : 0);
}
