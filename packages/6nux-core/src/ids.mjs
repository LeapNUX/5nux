// Copyright (c) 2026 Chu Ling and LeapNuX Contributors
// SPDX-License-Identifier: Apache-2.0

// ID generators for 6-NUX artifacts (R-XX, ADR-NNNN, etc.).

import { KEBAB_RE } from './conventions.mjs';

// R-XX pattern: 1-4 digits (some projects use R-001..R-9999)
export const RXX_PATTERN = /\bR-\d{1,4}\b/g;

// today as local-date YYYY-MM-DD
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Title → kebab-case slug
export function slugify(title) {
  return String(title).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isValidSlug(s) { return KEBAB_RE.test(s); }
