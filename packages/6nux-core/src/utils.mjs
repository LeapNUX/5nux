// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// Shared utilities for 6-NUX packages.

import matter from 'gray-matter';
import fs from 'node:fs';
import { VALID_DATE_RE } from './conventions.mjs';

export function parseMarkdownFrontmatter(content) {
  return matter(content);
}

// YAML-quote a string value: escape backslashes + double quotes, wrap in "..."
export function yamlQuote(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

// File-size guard for lint readers (DoS protection): throw if > maxBytes
export function readFileWithSizeCap(absPath, maxBytes = 10 * 1024 * 1024) {
  const stat = fs.statSync(absPath);
  if (stat.size > maxBytes) {
    const e = new Error(`File too large: ${stat.size} bytes (cap: ${maxBytes}). Refusing to read.`);
    e.code = 'EFILETOOLARGE';
    throw e;
  }
  return fs.readFileSync(absPath, 'utf-8');
}

// Validate date string against YYYY-MM-DD; throw if invalid
export function assertDateFormat(s, label = 'date') {
  if (!VALID_DATE_RE.test(s)) {
    const e = new Error(`Invalid ${label}: "${s}" — expected YYYY-MM-DD`);
    e.code = 'EINVALIDDATE';
    throw e;
  }
}
